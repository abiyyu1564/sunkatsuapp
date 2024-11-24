import React from "react";
import Logo from "../../../assets/Logo_Sunkatsu.png";
import Vector from "../../../assets/Vector_4.png";
import { Link } from "react-router-dom";

const Sign = () => {
  return (
    <div className="bg-[#F8F9FA] min-h-screen relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <img src={Logo} className="h-[110px] w-21" alt="Logo" />
        </div>
        <div className="flex space-x-2">
          <button className="px-10 py-1 bg-white text-black border border-gray-300 rounded-l shadow hover:shadow-lg transition-shadow">
            <a href="#" className="font-bold">
              Log in
            </a>
          </button>
          <button className="px-10 py-1 bg-[#8E0808] text-white rounded-r shadow hover:shadow-lg transition-shadow">
            <a href="#" className="font-bold">
              Sign Up
            </a>
          </button>
        </div>
      </div>

      {/* Vector Background */}
      <div className="absolute top-40 left-0 z-0">
        <img src={Vector} className="h-[600px] w-[550px]" alt="Vector" />
      </div>

      {/* Content Section */}
      <div className="flex items-center mt-24 relative left-10 h-72 ">
        {/* Form Container */}
        <div className="bg-white bg-opacity-50 rounded-lg shadow-lg w-[550px] p-10">
          <h1 className="text-3xl font-bold text-black mb-6">Welcome.</h1>
          <div className="flex">
            {/* Form Fields */}
            <form className="space-y-4 flex-1">
              <input
                type="text"
                placeholder="Enter your email address or username"
                className="w-full px-4 py-2 border border-black rounded focus:outline-none"
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-black rounded focus:outline-none"
              />
              <input
                type="password"
                placeholder="Re-enter your password"
                className="w-full px-4 py-2 border border-black rounded focus:outline-none"
              />
            </form>
            {/* Button */}
            <div className="flex items-start pl-6 pt-2">
              <button className="px-6 py-2 bg-[#8E0808] text-white rounded shadow hover:shadow-lg transition-shadow">
                <Link to="/login">Sign Up</Link>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Text */}
        <div className="ml-16">
          <h1 className="text-4xl font-bold text-black leading-snug">
            THE DELIGHTNESS <br />
            OF ORIENTAL KATSU.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Sign;
