import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Fade, Slide } from "react-awesome-reveal";
import backgroundImage from "../assets/hero2.jpg";

const Dashboard = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-gray-200 bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="z-10 max-w-4xl w-full space-y-8 flex flex-col items-center">
        <Fade duration={1000}>
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              Welcome to Your Dashboard
            </h2>
            {username && (
              <p className="mt-2 text-xl text-white">Hello, {username}!</p>
            )}
          </div>
        </Fade>
        <div className="mt-8 w-full space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
          <Slide direction="left" duration={500}>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  RAG System
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Explore our Retrieval-Augmented Generation system. This
                  powerful tool combines the benefits of retrieval-based and
                  generative AI to provide more accurate and context-aware
                  responses.
                </p>
                <div className="mt-4 flex justify-center">
                  <Link
                    to="/rag-system"
                    className="inline-flex items-center px-4 py-2 border-4 border-white text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Explore RAG System
                  </Link>
                </div>
              </div>
            </div>
          </Slide>
          <Slide direction="right" duration={500}>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Policies Chat
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Access our intelligent chatbot designed to answer all your
                  questions about company policies. Get quick and accurate
                  information on HR, IT, and other organizational guidelines.
                </p>
                <div className="mt-4 flex justify-center">
                  <Link
                    to="/policy-chat"
                    className="inline-flex items-center px-4 py-2 border-4 border-white text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Start Policy Chat
                  </Link>
                </div>
              </div>
            </div>
          </Slide>
        </div>
        <Fade duration={500}>
          <div className="mt-6">
            <Link
              to="/user"
              className="inline-flex items-center px-4 py-2 border-4 border-white text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              User Details
            </Link>
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default Dashboard;