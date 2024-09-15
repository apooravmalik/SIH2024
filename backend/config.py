import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

# Supabase configuration
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')

# Secret key
SECRET_KEY = os.getenv('SECRET_KEY')

# SMTP configuration
SMTP_PORT = os.getenv('SMTP_PORT')
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')

# GROQ API configuration
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

# You can add more configuration variables here as needed

# Function to check if all required environment variables are set
def check_env_variables():
    required_vars = [
        'SUPABASE_KEY', 'SUPABASE_URL', 'SECRET_KEY',
        'SMTP_PORT', 'SMTP_SERVER', 'SMTP_USER', 'SMTP_PASSWORD',
        'GROQ_API_KEY'
    ]
    
    missing_vars = [var for var in required_vars if os.getenv(var) is None]
    
    if missing_vars:
        raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Call this function to check for missing variables
check_env_variables()
print("Environment variables are set.")