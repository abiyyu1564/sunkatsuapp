import React, { useState } from "react";
import Logo from "../../assets/Logo_Sunkatsu.png";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { ReactComponent as ChatIcon } from "../Icon/Chat.svg";
import { ReactComponent as CartIcon } from "../Icon/Cart.svg";
import { ReactComponent as ProfileIcon } from "../Icon/Profile.svg";
import { ReactComponent as SearchIcon } from "../Icon/Search.svg";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate untuk routing
import Cookies from "js-cookie";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Hook untuk navigasi ke halaman lain

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Fungsi untuk handle logout
  const handleLogout = () => {
    // Menghapus token dari localStorage/sessionStorage
    Cookies.remove("token"); // Ganti dengan nama yang sesuai untuk token Anda

    // Atau jika token disimpan di sessionStorage
    // sessionStorage.removeItem("authToken");

    // Setelah logout, arahkan ke halaman login
    navigate("/login"); // Ganti dengan route login yang sesuai
  };

  return (
    <nav className="fixed top-0 w-full h-16 z-[99] shadow-lg bg-white">
      <div className="flex justify-between items-center px-3">
        <a href="/">
          <img src={Logo} className="h-16 w-auto" alt="Logo" />
        </a>

        {/* Menu Items (Desktop) */}
        <div className="hidden md:flex gap-14 items-center">
          <a className="text-black hover:text-red-700 pb-1" href="/">
            Home
          </a>
          <a className="text-black hover:text-red-700 pb-1" href="/menu">
            Menu
          </a>
          <a className="text-black hover:text-red-700 pb-1" href="/order">
            My Order
          </a>
        </div>

        {/* Navbar Icons (Desktop) */}
        <div className="hidden md:flex gap-8 items-center">
          <div className="flex items-center">
            <input
              className="h-9 border md p-2 rounded-lg bg-gray-50"
              placeholder="Search.."
            />
          </div>
          <a
            href="http://localhost:8080/chat.html"
            className="flex items-center"
          >
            <ChatIcon className="w-6 h-6" />
          </a>
          <a href="http://localhost:8080/stream.html">
            <FaQuestionCircle className="w-6 h-6" />
          </a>
          <a href="/cart" className="flex items-center">
            <CartIcon className="w-6 h-6" />
          </a>

          {/* Profile Icon with Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center"
            >
              <ProfileIcon className="w-10 h-10" />
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-black hover:bg-gray-100"
                >
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-black hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger Button (Mobile) */}
        <div className="flex flex-row gap-4 md:hidden">
          <SearchIcon className="w-6 h-6 md:hidden" onClick={toggleMenu} />
          <button
            className="block md:hidden text-gray-700 "
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <AiOutlineClose className="w-6 h-6" />
            ) : (
              <AiOutlineMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Menu for Mobile */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center gap-2 bg-white shadow-md py-4">
          <div className="flex items-center">
            <input
              className="h-9 border md p-2 rounded-lg bg-gray-50"
              placeholder="Search..."
            />
          </div>

          <a className="text-black" href="/home">
            Home
          </a>
          <a className="text-black" href="/menu">
            Menu
          </a>
          <a className="text-black" href="/order">
            My Order
          </a>

          <a href="/chat" className="flex items-center">
            <div className="flex flex-row justify-center items-center gap-1">
              <ChatIcon className="w-4 h-4" />
              <p>Chat</p>
            </div>
          </a>

          <a href="/cart" className="flex items-center">
            <div className="flex flex-row justify-center items-center gap-1">
              <CartIcon className="w-4 h-4" />
              <p>Cart</p>
            </div>
          </a>

          <a href="/profile" className="flex items-center">
            <div className="flex flex-row justify-center items-center gap-1">
              <ProfileIcon className="w-4 h-4" />
              <p>Profile</p>
            </div>
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
