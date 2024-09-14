from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.param_functions import Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from auth import main as auth_main
from SIHHR import embeddings_bot
from SIHRAG.rag import RAGSystem
import sys
import os
from pydantic import BaseModel
from typing import List, Optional

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)
sys.path.append(os.path.join(backend_dir, 'SIH-HR'))
sys.path.append(os.path.join(backend_dir, 'SIHRAG'))

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/api/auth/register")
async def register(request: auth_main.RegisterRequest):
    try:
        result = await auth_main.register_user(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
async def login(request: auth_main.LoginRequest):
    try:
        result = await auth_main.login_user(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.post("/api/auth/verify-otp")
async def verify_otp(request: auth_main.VerifyOTPRequest):
    try:
        result = await auth_main.verify_user_otp(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/auth/users/me")
async def get_user(token: str = Depends(oauth2_scheme)):
    try:
        result = await auth_main.read_users_me(token)
        return result
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.post("/api/auth/add-user-details")
async def add_user_details(user_details: auth_main.UserDetails, token: str = Depends(oauth2_scheme)):
    try:
        result = await auth_main.add_user_details(user_details, token)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# New embeddings-bot endpoints
class ChatRequest(BaseModel):
    prompt: str

class LogRequest(BaseModel):
    user_input: str
    bot_response: str
    button1_state: str
    button2_state: str
    review_text: str

@app.post("/api/hr/chat")
async def chat(request: ChatRequest):
    try:
        response = embeddings_bot.find_answer(request.prompt)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/hr/log")
async def log(request: LogRequest):
    try:
        embeddings_bot.log_interaction(
            request.user_input,
            request.bot_response,
            request.button1_state,
            request.button2_state,
            request.review_text
        )
        return {"status": "Log saved"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/hr")
async def index():
    return {"message": "Welcome to the HR embeddings-bot API"}


rag_system = RAGSystem()

class ProcessDocumentsRequest(BaseModel):
    input_type: str
    urls: Optional[List[str]] = []

@app.post("/api/rag/process_documents")
async def process_documents(
    input_type: str = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    urls: Optional[str] = Form(None)
):
    try:
        if input_type in ["PDFs", "Word Files", "TXT Files"]:
            if not files:
                raise HTTPException(status_code=400, detail="No files uploaded.")
            if input_type == "PDFs":
                texts, success = await rag_system.extract_text_from_pdfs(files)
            elif input_type == "Word Files":
                texts, success = await rag_system.extract_text_from_word(files)
            elif input_type == "TXT Files":
                texts, success = await rag_system.extract_text_from_txt(files)
        elif input_type == "URLs":
            if not urls:
                raise HTTPException(status_code=400, detail="No URLs provided.")
            url_list = urls.split(',')
            texts, success = await rag_system.fetch_url_content(url_list)
        else:
            raise HTTPException(status_code=400, detail="Invalid input type.")

        if not success:
            raise HTTPException(status_code=400, detail=texts)

        rag_system.vectorize_content(texts)
        return {"message": "Documents processed and embeddings generated successfully."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class QuestionRequest(BaseModel):
    query: str

@app.post("/api/rag/answer_question")
async def answer_question(request: QuestionRequest):
    try:
        query = request.query
        if not query:
            raise HTTPException(status_code=400, detail="Please provide a query.")

        rag_system.load_embeddings()
        relevant_chunks = rag_system.retrieve_relevant_content(query, k=3)
        combined_context = ' '.join(relevant_chunks)
        answer = rag_system.generate_answer(combined_context, query)

        return {
            "relevant_chunks": relevant_chunks,
            "answer": answer
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class ChatRequest(BaseModel):
    message: str

@app.post("/api/rag/chat")
async def chat(request: ChatRequest):
    try:
        user_message = request.message
        if not user_message:
            raise HTTPException(status_code=400, detail="Please enter a message to chat with the LLM.")

        response = rag_system.chat_with_llm(user_message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)