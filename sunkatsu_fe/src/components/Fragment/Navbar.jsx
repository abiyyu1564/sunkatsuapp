import React from "react";
import Logo from "../../assets/Logo_Sunkatsu.png";
import { GrHelpBook } from "react-icons/gr";
import defaultPP from "../../assets/defaultPP.png";

import { ReactComponent as SearchIcon } from "../Icon/Search.svg";
import { ReactComponent as ChatIcon } from "../Icon/Chat.svg";
import { ReactComponent as CartIcon } from "../Icon/Cart.svg";
import { ReactComponent as NotificationIcon } from "../Icon/notification.svg";
import { ReactComponent as ProfileIcon } from "../Icon/Profile.svg";

const Navbar = () => {
  const popup = () => {};

  return (
    <nav className="bg-white px-8 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a href="/home" className="flex items-center">
          <img src={Logo} className="h-[80px] w-auto" alt="Logo" />
        </a>

        {/* Menu Items */}
        <ul className="hidden md:flex space-x-8 text-gray-700">
          <li className="hover:text-red-500 cursor-pointer">Home</li>
          <li className="hover:text-red-500 cursor-pointer">Menu</li>
          <li className="hover:text-red-500 cursor-pointer">My Order</li>
        </ul>

        {/* Navbar icons and search */}
        <div className="flex items-center space-x-10">
          {/* Search Bar */}
          <a href="#" className="flex items-center text-black">
            <SearchIcon className="w-6 h-6" />
          </a>

          {/* Chat */}
          <a href="#" className="flex items-center text-black">
            <ChatIcon className="w-6 h-6" />
          </a>

          {/* cart */}
          <a href="#" className="flex items-center text-black">
            <CartIcon className="w-6 h-6" />
          </a>

          {/* Notifications */}
          <a href="#" className="flex items-center text-black">
            <NotificationIcon className="w-6 h-6" />
          </a>

          {/* Profile */}
          <a href="#" className="flex items-center text-black">
            <ProfileIcon className="w-10 h-10" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
