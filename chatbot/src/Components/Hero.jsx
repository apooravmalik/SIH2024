import backgroundImage from '../assets/hero2.jpg';
import { Fade, Zoom } from 'react-awesome-reveal';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col">
      {/* Top section with background image */}
      <div 
        className="relative w-full bg-cover bg-center flex flex-col items-center justify-center py-16"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          height: '70vh', // Adjust this value to control where the image ends
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        {/* Content */}
        <div className="relative z-10 text-white container mx-auto px-4 text-center">
          <Fade cascade triggerOnce direction="up">
            <h1 className="text-5xl font-bold mb-6">
              Connecting You to Answers: <br /> Welcome to HRGenie
            </h1>
          </Fade>
          <Fade delay={200} triggerOnce>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              HRGenie is your centralized platform for all employee queries and support. Easily access assistance, get documents processed, and find answers to your questions quickly and efficiently.
            </p>
          </Fade>
          <Zoom delay={400} triggerOnce>
          <Link to="/signin">
            <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300">
              Explore More
            </button>
            </Link>
          </Zoom>
        </div>

        {/* Dissolve effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-900"></div>
      </div>

      {/* Bottom section with solid background */}
      <div className="bg-gray-900 text-white flex-grow py-16">
        <div className="container mx-auto px-4">
          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Fade delay={600} triggerOnce direction="left">
              <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">RAG System</h2>
                <p className="text-base">
                  Our Retrieval-Augmented Generation (RAG) system enhances the chatbot&apos;s ability to process and analyze documents, delivering precise answers based on employee-uploaded content.
                </p>
              </div>
            </Fade>
            <Fade delay={700} triggerOnce direction="right">
              <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Policy Chat</h2>
                <p className="text-base">
                  The Policy Chat feature leverages AI to answer queries related to HR policies, IT support, and company events, ensuring efficient and accurate information delivery.
                </p>
              </div>
            </Fade>
          </div>

          {/* About Us Section */}
          <Fade delay={800} triggerOnce direction="up">
            <div id="about-us" className="bg-gray-800 p-8 rounded-lg shadow-lg text-left max-w-3xl mx-auto">
              <h2 className="text-3xl font-semibold mb-6 text-center">About Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="mb-4"><strong>Target Audience:</strong> Employees of large public sector organizations</p>
                  <p className="mb-4"><strong>Potential Impact:</strong></p>
                  <ul className="list-disc ml-6 mb-6">
                    <li>Improved employee productivity and satisfaction</li>
                    <li>Reduced workload on HR and IT support teams</li>
                    <li>Faster access to accurate organizational information</li>
                    <li>Enhanced security and compliance in information sharing</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-4"><strong>Benefits:</strong></p>
                  <ul className="list-disc ml-6">
                    <li><strong>Social:</strong> Better work environment and employee well-being</li>
                    <li><strong>Economic:</strong> Cost savings in support operations</li>
                    <li><strong>Operational:</strong> Streamlined processes and reduced response times</li>
                    <li><strong>Technological:</strong> Showcase of AI application in organizational management</li>
                  </ul>
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center">
        <Fade delay={900} triggerOnce>
          <p>Created by Data Drifters ❤️</p>
        </Fade>
      </footer>
    </section>
  );
};

export default Hero;