import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Fade, Slide } from 'react-awesome-reveal';
import { Send } from 'lucide-react';
import backgroundImage from '../assets/hero2.jpg';

const PolicyChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContentRef = useRef(null);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/hr/chat/', { prompt: input });
      const botMessage = { type: 'bot', content: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { type: 'bot', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col"
         style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Main content */}
      <main className="flex-grow container mx-auto py-6 sm:px-6 lg:px-8 z-10 relative">
        <div className="bg-white relative bg-opacity-90 top-12 rounded-lg shadow-xl flex flex-col justify-between h-full">
          <Fade duration={1000}>
            <div ref={chatContentRef} className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <Slide key={index} direction={message.type === 'user' ? 'left' : 'right'} duration={500}>
                  <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                      {message.content}
                    </div>
                  </div>
                </Slide>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </Fade>
          <Fade duration={1000}>
            <form onSubmit={handleSubmit} className="bg-gray-100 p-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How can I help you?"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <Send size={24} />
                </button>
              </div>
            </form>
          </Fade>
        </div>
      </main>
    </div>
  );
};

export default PolicyChat;
