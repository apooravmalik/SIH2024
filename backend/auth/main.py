from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
import pyotp
from supabase import create_client, Client
import os
from dotenv import load_dotenv
# from auth.email_utils import send_email
import logging
import sys
import os

# Add the parent directory of 'auth' to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import SUPABASE_URL, SUPABASE_KEY, SECRET_KEY, SMTP_PORT, SMTP_SERVER, SMTP_USER, SMTP_PASSWORD

from .email_utils import send_email

# Load environment variables
load_dotenv()


# Constants
# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_KEY = os.getenv("SUPABASE_KEY")
# SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize FastAPI app
app = FastAPI()

# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# JWT token management
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# User models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str | None = None
    otp_secret: str | None = None

class UserInDB(User):
    hashed_password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class VerifyOTPRequest(BaseModel):
    username: str
    otp: str
    
class UserDetails(BaseModel):
    name: str
    phone_number: str
    email: str
    team: str
    designation: str
    holidays_taken: int

# Utility functions
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_from_supabase(username: str):
    response = supabase.table("users").select("*").eq("username", username).execute()
    if response.data:
        return UserInDB(**response.data[0])
    return None

# Routes
@app.post("/register/")
async def register_user(request: RegisterRequest):
    otp_secret = pyotp.random_base32()
    user_data = {
        "username": request.username,
        "email": request.email,
        "hashed_password": request.password,  # In a real scenario, hash the password before storing it
        "otp_secret": otp_secret,
        "is_active": True
    }

    response = supabase.table("users").insert(user_data).execute()

    if response.data:
        return {"message": "User registered successfully"}
    else:
        raise HTTPException(status_code=400, detail="Registration failed")

@app.post("/login/")
async def login_user(request: LoginRequest):
    user = get_user_from_supabase(request.username)
    if not user or user.hashed_password != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    otp_secret = user.otp_secret
    totp = pyotp.TOTP(otp_secret)
    otp = totp.now()

    # Send the OTP to the user's email
    send_email(user.email, "Your OTP Code", f"Your OTP code is: {otp}")

    # Include the OTP in the response (for development purposes only)
    return {"message": f"OTP sent to user's email. For testing, the OTP is: {otp}"}

@app.post("/verify-otp/")
async def verify_user_otp(request: VerifyOTPRequest):
    user = get_user_from_supabase(request.username)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    totp = pyotp.TOTP(user.otp_secret)
    
    # Log the OTP verification process
    is_valid = totp.verify(request.otp, valid_window=2)
    logging.info(f"User: {request.username}, Entered OTP: {request.otp}, Expected OTP: {totp.now()}, OTP Valid: {is_valid}")

    if is_valid:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP")

@app.get("/users/me", response_model=User)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = get_user_from_supabase(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


@app.post("/add-user-details/")
async def add_user_details(user_details: UserDetails, token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Get the user's ID from the users table
    user_response = supabase.table("users").select("id").eq("username", username).execute()
    if not user_response.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = user_response.data[0]['id']

    # Prepare user details data
    user_details_data = user_details.dict()
    user_details_data['user_id'] = user_id

    # Insert user details into the user_details table
    response = supabase.table("user_details").insert(user_details_data).execute()

    if response.data:
        return {"message": "User details added successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to add user details")