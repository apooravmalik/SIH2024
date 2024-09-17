import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Fade, Slide } from 'react-awesome-reveal';
import { Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import backgroundImage from '../assets/hero2.jpg';

const FeedbackModal = ({ isOpen, onClose, onSubmit, feedbackType, setFeedbackType, feedbackText, setFeedbackText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Provide Feedback</h2>
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => setFeedbackType('thumbsUp')}
            className={`p-2 rounded-full ${feedbackType === 'thumbsUp' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <ThumbsUp size={24} />
          </button>
          <button
            onClick={() => setFeedbackType('thumbsDown')}
            className={`p-2 rounded-full ${feedbackType === 'thumbsDown' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <ThumbsDown size={24} />
          </button>
        </div>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Additional comments..."
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={onSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        </div>
      </div>
    </div>
  );
};

FeedbackModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  feedbackType: PropTypes.string,
  setFeedbackType: PropTypes.func.isRequired,
  feedbackText: PropTypes.string.isRequired,
  setFeedbackText: PropTypes.func.isRequired,
};

const PolicyChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(null);
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
      let errorMessage;
      if (error.response && error.response.status === 400) {
        // Handle the 400 Bad Request error, which includes the profanity case
        errorMessage = { type: 'bot', content: error.response.data.response || 'Please use appropriate language or provide a valid query.' };
      } else {
        // Handle other types of errors
        errorMessage = { type: 'bot', content: 'Sorry, I encountered an error. Please try again.' };
      }
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const openFeedbackModal = (index) => {
    setCurrentMessageIndex(index);
    setShowFeedbackModal(true);
  };

  const submitFeedback = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/hr/log', {
        user_input: messages[currentMessageIndex - 1].content,
        bot_response: messages[currentMessageIndex].content,
        button1_state: feedbackType === 'thumbsUp' ? '1' : '0',
        button2_state: feedbackType === 'thumbsDown' ? '1' : '0',
        review_text: feedbackText
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      setShowFeedbackModal(false);
      setFeedbackType(null);
      setFeedbackText('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
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
                      {message.type === 'bot' && (
                        <button
                          onClick={() => openFeedbackModal(index)}
                          className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                        >
                          Feedback
                        </button>
                      )}
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

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={submitFeedback}
        feedbackType={feedbackType}
        setFeedbackType={setFeedbackType}
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
      />
    </div>
  );
};

export default PolicyChat;