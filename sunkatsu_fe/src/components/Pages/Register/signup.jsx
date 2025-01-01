import React, { useState } from "react";
import Logo from "../../../assets/Logo_Sunkatsu.png";
import { useNavigate } from "react-router-dom";
import NewLandingFooter from "../../Fragment/newFooter";
import axios from "axios";

const Signup = () => {
  const [input, setInput] = useState({
    id: "string",
    username: "",
    password: "",
    role: "STAFF",
    status: "ONLINE",
  });

  const [showPassword, setShowPassword] = useState(false); // State untuk mengontrol visibilitas password
  const navigate = useNavigate();

  // Handle Input Change
  const handleInput = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

  // Handle Signup
  const handleSignup = (event) => {
    event.preventDefault();
    const { id, username, password, role, status } = input;

    axios
      .post("http://localhost:8080/api/auth/register", {
        id,
        username,
        password,
        role,
        status,
      })
      .then(() => {
        alert("Signup Success");
        navigate("/login");
      })
      .catch(() => {
        alert("Failed to register");
      });
  };

  // Toggle Password Visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col bg-primary min-h-screen">
      {/* Navbar */}
      <nav className="fixed flex flex-col sm:flex-row top-0 w-full shadow-lg justify-between bg-white px-4 py-2">
        <div className="flex justify-start items-center px-4 sm:px-10 w-full sm:w-auto">
          <a href="/login">
            <img src={Logo} className="h-12 sm:h-16 w-auto" alt="Logo" />
          </a>
        </div>
      </nav>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row min-h-screen items-center justify-center md:justify-between md:px-16">
        {/* Left Side Text */}
        <div className="hidden sm:flex ml-0 sm:ml-16 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-black leading-snug">
            THE DELIGHTNESS <br />
            OF ORIENTAL KATSU.
          </h1>
        </div>
        {/* Form Container */}
        <div className="bg-white bg-opacity-50 rounded-lg shadow-lg w-full sm:w-[550px] p-6 sm:p-10 mb-8 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6">
            Welcome.
          </h1>
          <form className="space-y-4" onSubmit={handleSignup}>
            {/* Username Input */}
            <input
              type="text"
              name="username"
              value={input.username}
              onChange={handleInput}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-sm sm:text-base"
            />

            {/* Email Input */}
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-sm sm:text-base"
            />

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={input.password}
                onChange={handleInput}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-black rounded focus:outline-none text-sm sm:text-base"
              />
              {/* Show Password Checkbox */}
              <div className="flex items-center mt-2">
                <input
                  id="show-password"
                  type="checkbox"
                  checked={showPassword}
                  onChange={handleTogglePassword}
                  className="w-4 h-4 border-gray-300 rounded"
                />
                <label htmlFor="show-password" className="ml-2 text-sm text-black">
                  Show Password
                </label>
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full px-6 py-2 bg-[#8E0808] text-white rounded shadow hover:shadow-lg transition-shadow text-sm sm:text-base"
            >
              Sign Up
            </button>
          </form>

          {/* Redirect to Login */}
          <div className="flex flex-row justify-start gap-3 mt-4">
            <p className="text-black">Already have an account?</p>
            <a href="/login" className="hover:text-tertiary">
              Login
            </a>
          </div>
        </div>
      </div>

      <NewLandingFooter />
    </div>
  );
};

export default Signup;
