import React from "react";
import Logo from "../../assets/combined_logo_fixed.png";
import nameimg from "../../assets/tulisan_SUNKATSU.png";
import { FaCartShopping, FaBell } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { IoReceipt } from "react-icons/io5";
import { Link } from "react-router-dom";
import defaultPP from "../../assets/defaultPP.png";

const Navbar = () => {
 const popup = () => {
   
 }

  return (
    <nav className="bg-[#FF0000] border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-1">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3">
          <img src={Logo} className="h-16 w-16" alt="Logo" />
          <span className="text-2xl font-semibold whitespace-nowrap dark:text-white">
            <img src={nameimg} alt="Sunkatsu" />
          </span>
        </a>

        {/* Navbar icons and search */}
        <div className="flex items-center space-x-8">
          {/* Cart */}
          <a href="#" className="flex flex-col items-center text-white">
            <FaCartShopping size={32} />
            <p className="text-xs">Cart</p>
          </a>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              id="search-navbar"
              className="block w-80 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Search..."
            />
            <svg
              className="absolute top-1/2 left-3 transform -translate-y-1/2 w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          {/* Home */}
          <a href="#" className="flex flex-col items-center text-white">
            <FaHome size={32} />
            <p className="text-xs">Home</p>
          </a>

          {/* Notifications */}
          <a href="#" className="flex flex-col items-center text-white">
            <FaBell size={32} />
            <p className="text-xs">Notifications</p>
          </a>

          {/* My Order */}
          <a href="#" className="flex flex-col items-center text-white">
            <IoReceipt size={32} />
            <p className="text-xs">My Order</p>
          </a>
        </div>

        <button>
          <img
            src={defaultPP}
            alt="profile"
            className=" w-12 h-12 rounded-full"
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
