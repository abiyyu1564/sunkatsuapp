import React, { useState } from "react";
import Logo from "../../../assets/Logo_Sunkatsu.png";
import NewLandingFooter from "../../Fragment/newFooter";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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

  // Handle Toggle Password Visibility
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

        {/* Login Form */}
        <div className="rounded-lg shadow-lg w-full sm:w-[550px] p-6 sm:p-10 mb-8 sm:mb-0 bg-white bg-opacity-50">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-6">
            Welcome.
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Username */}
            <input
              type="text"
              name="username"
              value={input.username}
              onChange={handleInput}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-black rounded focus:outline-none text-sm sm:text-base"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={input.password}
                onChange={handleInput}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-black rounded focus:outline-none text-sm sm:text-base"
              />
              {/* Checkbox untuk toggle */}
              <div className="flex items-center mt-2">
                <input
                  id="checkbox"
                  type="checkbox"
                  checked={showPassword}
                  onChange={handleTogglePassword}
                  className="w-4 h-4 border-black rounded"
                />
                <label htmlFor="checkbox" className="ml-2 text-sm text-black">
                  Show Password
                </label>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-secondary text-white rounded shadow hover:shadow-lg transition-shadow text-sm sm:text-base"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <div className="flex flex-row justify-start gap-3 mt-4">
            <p className="text-black">Don't have an account?</p>
            <button className="hover:text-tertiary">
              <a href="/signup">Sign Up</a>
            </button>
          </div>
        </div>
      </div>

      <NewLandingFooter />
    </div>
  );
};

export default Login;
