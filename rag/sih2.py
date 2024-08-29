import json
import numpy as np
import faiss
import streamlit as st
from sentence_transformers import SentenceTransformer

# Load the SentenceTransformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load JSON data
with open('knowledge_base.json', 'r') as f:
    data = json.load(f)

# Extract questions and answers
questions = [entry['question'] for category in data['knowledge_base'] for entry in category['entries']]
answers = {entry['question']: entry['answer'] for category in data['knowledge_base'] for entry in category['entries']}

# Create embeddings for questions
question_embeddings = model.encode(questions, convert_to_tensor=True)

# Set up FAISS index
index = faiss.IndexFlatL2(question_embeddings.shape[1])
index.add(np.array(question_embeddings))

# Streamlit app
st.title('FAQ Chatbot')

user_query = st.text_input("Ask your question:")

if user_query:
    # Encode the user query
    user_query_embedding = model.encode([user_query], convert_to_tensor=True)
    
    # Search for the closest question
    distances, indices = index.search(np.array(user_query_embedding), k=1)
    closest_question_index = indices[0][0]
    closest_question = questions[closest_question_index]
    
    # Retrieve and display the answer
    answer = answers.get(closest_question, "Sorry, I don't have an answer for that.")
    st.write(answer)
