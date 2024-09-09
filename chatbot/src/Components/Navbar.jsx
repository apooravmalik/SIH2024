import React from 'react';
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { Fade } from "react-awesome-reveal";

const Navbar = () => {
  const scrollToAboutUs = (event) => {
    event.preventDefault();
    const aboutUsSection = document.getElementById('about-us');
    if (aboutUsSection) {
      aboutUsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-transparent fixed top-0 left-0 w-full flex justify-between items-center p-4 z-50">
      <Fade triggerOnce>
        <div className="flex items-center">
          <img src={logo} alt="GAIL Logo" className="h-8 w-auto mr-3" />
          <span className="text-white font-bold text-lg">GAIL</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <a href="#about-us" onClick={scrollToAboutUs} className="text-white hover:text-gray-300">
            About Us
          </a>
          <Link to="/signin" className="text-white hover:text-gray-300">
            Sign In
          </Link>
          <Link to="/register" className="text-white hover:text-gray-300">
            Register
          </Link>
        </div>
        <Link
          to="/contact"
          className="text-white border border-white px-3 py-1 rounded hover:bg-white hover:text-black"
        >
          Contact Us
        </Link>
      </Fade>
    </nav>
  );
};

export default Navbar;