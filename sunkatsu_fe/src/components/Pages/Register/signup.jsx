import React from "react";
import Logo from "../../../assets/Logo_Sunkatsu.png";
import Vector from "../../../assets/Vector_4.png";
import { Link } from "react-router-dom";
import NewLandingFooter from "../../Fragment/newFooter";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <nav className="flex flex-col sm:flex-row top-0 w-full shadow-lg justify-between bg-white px-1/2 py-2 sm:py-0">
        <div className="flex justify-start items-center px-2 sm:px-10 w-full sm:w-auto">
          <a href="/login">
            <img src={Logo} className="h-12 sm:h-16 w-auto" alt="Logo" />
          </a>
        </div>
      </nav>

      {/* Content Section */}
      <div className="flex flex-col min-h-screen sm:flex-row items-center justify-start md:justify-start md:mt-0 sm:mt-2 relative px-4 sm:px-10 gap-4 py-2">
        {/* Form Container */}
        <div className="bg-white bg-opacity-50 rounded-lg shadow-lg w-full sm:w-[550px] p-6 sm:p-10 mb-8 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6">Welcome.</h1>
          <div className="flex flex-col sm:flex-row">
            {/* Form Fields */}
            <form className="space-y-4 flex-1">
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-black rounded focus:outline-none text-sm sm:text-base"
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-black rounded focus:outline-none text-sm sm:text-base"
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-black rounded focus:outline-none text-sm sm:text-base"
              />
              <div className="flex flex-row">
                <p className="mr-3">Already have an account?</p>
                  <button className="flex flex-row hover:text-tertiary">
                    <a href="/login">Login</a>
                  </button>
              </div>
            </form>

            {/* Button */}
            <div className="flex items-start sm:pl-6 pt-4 sm:pt-0">
              <button className="w-full sm:w-auto px-6 py-2 bg-[#8E0808] text-white rounded shadow hover:shadow-lg transition-shadow text-sm sm:text-base">
                <Link to="/home">Sign Up</Link>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Text */}
        <div className="hidden sm:flex ml-0 sm:ml-16 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-black leading-snug">
            THE DELIGHTNESS <br />
            OF ORIENTAL KATSU.
          </h1>
        </div>
      </div>
      <NewLandingFooter/>
    </div>
  );
};

export default Login;

