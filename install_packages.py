import subprocess
import sys

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package, "--user", "--no-cache-dir"])

packages = [
    "streamlit",
    "pypdfium2",
    "requests",
    "beautifulsoup4",
    "sentence-transformers",
    "faiss-cpu",
    "numpy",
    "validators",
    "docx2txt",
    "chainlit",
    "langchain",
    "langchain_community",
    "PyPDF2",
    "chromadb",
    "groq",
    "langchain-groq",
    "python-dotenv",
    "ollama"
]

for package in packages:
    print(f"Installing {package}...")
    try:
        install(package)
        print(f"Successfully installed {package}")
    except subprocess.CalledProcessError:
        print(f"Failed to install {package}")

print("Installation process completed.")