import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Send } from 'lucide-react';
import { Fade } from 'react-awesome-reveal';
import backgroundImage from '../assets/Hero.png';

const RagSystem = () => {
  const [activeTab, setActiveTab] = useState('RAG Chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState('');
  const [url, setUrl] = useState('');

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    setUploadedFiles(files);
    setIsLoading(true);
    setIsThinking(true);

    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }

    const fileType = files[0].type;
    if (fileType.includes('pdf')) {
      formData.append('input_type', 'PDFs');
    } else if (fileType.includes('msword') || fileType.includes('officedocument')) {
      formData.append('input_type', 'Word Files');
    } else if (fileType.includes('text')) {
      formData.append('input_type', 'TXT Files');
    }

    axios.post('http://localhost:7000/process_documents', formData)
      .then(res => {
        console.log(res.data);
        setIsLoading(false);
        setIsThinking(false);
        setMessages(prevMessages => [...prevMessages, { text: "Documents processed successfully!", isUser: false }]);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        setIsThinking(false);
        setMessages(prevMessages => [...prevMessages, { text: "Error processing documents.", isUser: false }]);
      });
  };

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    setMessages(prevMessages => [...prevMessages, { text: userInput, isUser: true }]);
    setIsThinking(true);

    const endpoint = activeTab === 'RAG Chat' ? '/answer_question' : '/chat';
    const formData = new FormData();
    formData.append('query', userInput);

    axios.post(`http://localhost:7000${endpoint}`, formData)
      .then(res => {
        setIsThinking(false);
        setMessages(prevMessages => [...prevMessages, { text: res.data.answer || res.data.response, isUser: false }]);
        setResponse(res.data.answer || res.data.response);
      })
      .catch(err => {
        console.error(err);
        setIsThinking(false);
        setMessages(prevMessages => [...prevMessages, { text: "Error processing your request.", isUser: false }]);
      });

    setUserInput('');
  };

  const handleUrlSubmit = () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setIsThinking(true);

    const formData = new FormData();
    formData.append('input_type', 'URLs');
    formData.append('urls', url);

    axios.post('http://localhost:7000/process_documents', formData)
      .then(res => {
        console.log(res.data);
        setIsLoading(false);
        setIsThinking(false);
        setMessages(prevMessages => [...prevMessages, { text: "URL content processed successfully!", isUser: false }]);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        setIsThinking(false);
        setMessages(prevMessages => [...prevMessages, { text: "Error processing the URL content.", isUser: false }]);
      });

    setUrl('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-cover bg-center relative" 
         style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <main className="relative z-10 flex-grow flex items-center justify-center w-full max-w-4xl px-4 py-8">
        <Fade>
          <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full">
            <div className="flex justify-center mb-4">
              <button
                onClick={() => handleTabSwitch('RAG Chat')}
                className={`px-4 py-2 rounded-l-lg transition-colors ${activeTab === 'RAG Chat' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                RAG Chat
              </button>
              <button
                onClick={() => handleTabSwitch('Direct LLM Chat')}
                className={`px-4 py-2 rounded-r-lg transition-colors ${activeTab === 'Direct LLM Chat' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Direct LLM Chat
              </button>
            </div>

            <div className="flex flex-col h-64 overflow-y-auto mb-4 space-y-2">
              {messages.map((msg, idx) => (
                <Fade key={idx} direction={msg.isUser ? "left" : "right"}>
                  <div className={`p-2 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded-lg ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                      {msg.text}
                    </span>
                  </div>
                </Fade>
              ))}
              {isThinking && (
                <Fade>
                  <div className="text-left">
                    <span className="inline-block p-2 rounded-lg bg-gray-200">
                      Thinking...
                    </span>
                  </div>
                </Fade>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={userInput}
                onChange={handleUserInput}
                className="flex-grow border p-2 rounded-l-lg"
                placeholder="How can I help you?"
              />
              <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded-r-lg transition-colors hover:bg-blue-600">
                <Send size={20} />
              </button>
            </div>
          </div>
        </Fade>
      </main>

      <footer className="relative z-10 w-full p-4 bg-gray-800 bg-opacity-80 text-white">
        <Fade>
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <label htmlFor="file-upload" className="cursor-pointer flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors hover:bg-blue-600">
                <Upload size={20} />
                <span>Choose Files</span>
              </label>
              <input id="file-upload" type="file" multiple onChange={handleFileUpload} className="hidden" />
              <span>{uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) selected` : 'No file chosen'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
                className="border p-2 rounded-lg text-black"
              />
              <button onClick={handleUrlSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors hover:bg-blue-600">
                Submit URL
              </button>
            </div>
          </div>
        </Fade>
      </footer>
    </div>
  );
};

export default RagSystem;
