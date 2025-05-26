"use client";

import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaUser, FaKey } from "react-icons/fa";
import Gambar_Login from "../../../assets/gambar_login.png";

const Login = () => {
  const [input, setInput] = useState({
    id: "string",
    username: "",
    password: "",
    role: "STAFF",
    status: "ONLINE",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorPosition, setIndicatorPosition] = useState({
    left: 0,
    width: 0,
  });
  const buttonRefs = useRef([]);
  const signItems = ["Login", "Register"];

  useEffect(() => {
    updateIndicator();
  }, [activeIndex]);

  const updateIndicator = () => {
    if (buttonRefs.current[activeIndex]) {
      const button = buttonRefs.current[activeIndex];
      setIndicatorPosition({
        left: button.offsetLeft,
        width: button.offsetWidth,
      });
    }
  };

  const handleButtonClick = (index) => {
    setActiveIndex(index);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const nextIndex = (activeIndex + 1) % signItems.length;
      setActiveIndex(nextIndex);
    }
  };

  // Handle Input Change
  const handleInput = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

  // Show Login Toast
  const loginPopup = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Signed in successfully",
    });
  };

  // Handle Login
  const handleLogin = (event) => {
    event.preventDefault();
    const { id, username, password, role, status } = input;

    axios
      .post("http://localhost:8080/api/auth/login", {
        id,
        username,
        password,
        role,
        status,
      })
      .then((res) => {
        Cookies.set("token", res.data.token, { expires: 1 });
        loginPopup();
        navigate("/menu");
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Wrong username or password",
        });
      });
  };

  const handleRegister = (event) => {
    event.preventDefault();
    // Implement registration logic here
    console.log("Registering user:", input);
  };

  // Handle Toggle Password Visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
          <div className="max-w-md w-full space-y-6 sm:space-y-8">
            {/* Logo and Title - Responsive sizing */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                SUNKATSU
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Selamat Datang
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                {activeIndex === 0
                  ? "Silahkan masukkan identitas anda"
                  : "Lengkapi form berikut untuk mendaftar"}
              </p>
            </div>

            {/* Tab Switcher - Responsive */}
            <div
              className="flex w-full items-center justify-center h-16 sm:h-20 lg:h-24"
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              <div className="relative flex w-full max-w-sm sm:max-w-md justify-around items-center h-8 sm:h-10 py-1 mx-4 sm:mx-10 gap-1 sm:gap-2 rounded-xl shadow-2xl overflow-hidden bg-white">
                <div
                  className="absolute bg-tertiary rounded-xl h-8 sm:h-10 transition-all duration-300 ease-in-out"
                  style={{
                    left: `${indicatorPosition.left}px`,
                    width: `${indicatorPosition.width}px`,
                  }}
                ></div>

                {signItems.map((item, index) => (
                  <button
                    key={index}
                    ref={(el) => (buttonRefs.current[index] = el)}
                    className={`relative z-0 flex items-center justify-center font-sans w-32 sm:w-48 md:w-56 lg:w-96 text-sm sm:text-md lg:text-xl font-semibold rounded-xl transition-all duration-300 ${
                      activeIndex === index ? "text-white" : "text-[#8E0808]"
                    }`}
                    onClick={() => handleButtonClick(index)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Section - Responsive spacing */}
            <form
              onSubmit={activeIndex === 0 ? handleLogin : handleRegister}
              className="space-y-3 sm:space-y-4"
            >
              {/* Username - Responsive input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-500 text-sm sm:text-base" />
                  <div className="border-r mx-1 sm:mx-2 h-4 sm:h-5 border-gray-300 mr-2 sm:mr-3" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={input.username}
                  onChange={handleInput}
                  placeholder="Username"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  required
                />
              </div>

              {/* Password - Responsive input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <FaKey className="text-gray-500 text-sm sm:text-base" />
                  <div className="border-r mx-1 sm:mx-2 h-4 sm:h-5 border-gray-300 mr-2 sm:mr-3" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={input.password}
                  onChange={handleInput}
                  placeholder="Password"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  required
                />
              </div>

              {/* Confirm Password for Register - Responsive */}
              {activeIndex === 1 && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-500 text-sm sm:text-base" />
                    <div className="border-r mx-1 sm:mx-2 h-4 sm:h-5 border-gray-300 mr-2 sm:mr-3" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    required
                  />
                </div>
              )}

              {/* Show Password - Responsive checkbox */}
              <div className="flex items-center mt-2">
                <input
                  id="show-password"
                  type="checkbox"
                  checked={showPassword}
                  onChange={handleTogglePassword}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="show-password"
                  className="ml-2 text-xs sm:text-sm text-gray-600"
                >
                  Show Password
                </label>
              </div>

              {/* Submit Button - Responsive */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 sm:py-3 px-3 sm:px-4 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  {activeIndex === 0 ? "Login →" : "Register →"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side Illustration - Responsive visibility and sizing */}
        <div className="hidden md:flex flex-1 bg-white items-center justify-center p-6 lg:p-12">
          <div className="max-w-sm md:max-w-md lg:max-w-lg">
            <img
              src={Gambar_Login || "/placeholder.svg"}
              alt="Cute food characters"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
