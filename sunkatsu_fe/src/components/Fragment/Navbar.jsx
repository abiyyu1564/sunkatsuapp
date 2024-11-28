import React, { useState } from "react";
import Logo from "../../assets/Logo_Sunkatsu.png";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { ReactComponent as SearchIcon } from "../Icon/Search.svg";
import { ReactComponent as ChatIcon } from "../Icon/Chat.svg";
import { ReactComponent as CartIcon } from "../Icon/Cart.svg";
import { ReactComponent as NotificationIcon } from "../Icon/notification.svg";
import { ReactComponent as ProfileIcon } from "../Icon/Profile.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full h-16 z-[99] shadow-lg bg-white transition ease-in-out duration-200">
      <div className="flex justify-between items-center px-10">
        {/* Logo */}
        <a href="/home">
          <img src={Logo} className="h-16 w-auto" alt="Logo" />
        </a>

        {/* Menu Items (Desktop) */}
        <div className="hidden md:flex gap-14 items-center">
          <a className="text-black hover:text-red-700 pb-1" href="#">Home</a>
          <a className="text-black hover:text-red-700 pb-1" href="#">Menu</a>
          <a className="text-black hover:text-red-700 pb-1" href="#">My Order</a>
        </div>

        {/* Navbar Icons (Desktop) */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="#" className="flex items-center hover:text-red-600">
            <SearchIcon className="w-6 h-6" />
          </a>
          <a href="#" className="flex items-center hover:text-red-600">
            <ChatIcon className="w-6 h-6" />
          </a>
          <a href="#" className="flex items-center hover:text-red-600">
            <CartIcon className="w-6 h-6" />
          </a>
          <a href="#" className="flex items-center hover:text-red-600">
            <NotificationIcon className="w-6 h-6" />
          </a>
          <a href="#" className="flex items-center hover:text-red-600">
            <ProfileIcon className="w-10 h-10" />
          </a>
        </div>

        {/* Hamburger Button (Mobile) */}
        <button
          className="block md:hidden text-gray-700"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <AiOutlineClose className="w-6 h-6" />
          ) : (
            <AiOutlineMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Menu for Mobile */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center bg-white shadow-md py-4">
          <a className="text-black hover:text-red-700 pb-2" href="#">Home</a>
          <a className="text-black hover:text-red-700 pb-2" href="#">Menu</a>
          <a className="text-black hover:text-red-700 pb-2" href="#">My Order</a>
          <a href="#" className="flex items-center hover:text-red-600 py-2">
            <SearchIcon className="w-6 h-6" />
          </a>
          <a href="#" className="flex items-center hover:text-red-600 py-2">
            <ChatIcon className="w-6 h-6" />
          </a>
          <a href="#" className="flex items-center hover:text-red-600 py-2">
            <CartIcon className="w-6 h-6" />
          </a>
          <a href="#" className="flex items-center hover:text-red-600 py-2">
            <NotificationIcon className="w-6 h-6" />
          </a>
          <a href="#" className="flex items-center hover:text-red-600 py-2">
            <ProfileIcon className="w-10 h-10" />
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
