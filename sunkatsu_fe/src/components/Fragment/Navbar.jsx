import React from "react";
import Logo from "../../assets/Logo_Sunkatsu.png";
import { FaCartShopping, FaBell } from "react-icons/fa6";
import { GrChat } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { GrHelpBook } from "react-icons/gr";
import defaultPP from "../../assets/defaultPP.png";

const Navbar = () => {
  const popup = () => {};

  return (
    <nav className="flex items-center justify-between bg-white py-2 px-8 shadow-md">
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img src={Logo} className="h-[75px] w-auto" alt="Logo" />
        </a>

        {/* Menu Items */}
        <ul className="hidden md:flex space-x-8 text-gray-700">
          <li className="hover:text-red-500 cursor-pointer">Beranda</li>
          <li className="hover:text-red-500 cursor-pointer">Tentang</li>
          <li className="hover:text-red-500 cursor-pointer">Layanan</li>
          <li className="hover:text-red-500 cursor-pointer">Kontak</li>
        </ul>

        {/* Navbar icons and search */}
        <div className="flex items-center space-x-8">
          {/* Search Bar */}
          <a href="#" className="flex flex-col items-center text-black">
            <FaSearch size={18} />
          </a>

          {/* Chat */}
          <a href="#" className="flex flex-col items-center text-black">
            <GrChat size={18} />
          </a>         

          {/* cart */}
          <a href="#" className="flex flex-col items-center text-black">
            <FaCartShopping size={18} />
          </a>

          {/* Notifications */}
          <a href="#" className="flex flex-col items-center text-black">
            <GrHelpBook size={18} />
          </a>

          
        </div>

         {/* Profile Button */}
         <button className="m1-4">
          <img
            src={defaultPP}
            alt="profile"
            className="w-10 h-10 rounded-full border border-gray-300 hover:shadow-md transition duration-300"
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
