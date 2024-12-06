import React, { useState } from "react";
import Logo from "../../assets/Logo_Sunkatsu.png";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { ReactComponent as ChatIcon } from "../Icon/Chat.svg";
import { ReactComponent as CartIcon } from "../Icon/Cart.svg";
import { ReactComponent as ProfileIcon } from "../Icon/Profile.svg";
import { ReactComponent as SearchIcon } from "../Icon/Search.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full h-16 z-[99] shadow-lg bg-white transition ease-in-out duration-200">
      <div className="flex justify-between items-center px-3">
        <a href="/home">
          <img src={Logo} className="h-16 w-auto" alt="Logo" />
        </a>

        {/* Menu Items (Desktop) */}
        <div className="hidden md:flex gap-14 items-center">
          <a className="text-black hover:text-red-700 pb-1" href="/home">
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
          <a href="/chat" className="flex items-center">
            <ChatIcon className="w-6 h-6" />
          </a>
          <a href="/cart" className="flex items-center">
            <CartIcon className="w-6 h-6" />
          </a>
          <a href="#/profile" className="flex items-center">
            <ProfileIcon className="w-10 h-10" />
          </a>
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
