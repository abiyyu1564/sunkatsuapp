import React from "react";
import Logo from "../../assets/combined_logo_fixed.png";
import nameimg from "../../assets/tulisan_SUNKATSU.png";
import { FaCartShopping, FaBell } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { IoReceipt } from "react-icons/io5";
import { Link } from "react-router-dom";
import defaultPP from "../../assets/defaultPP.png";

const NavbarLanding = () => {
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
        <button className="bg-white text-[#FF0000] font-bold py-2 px-4 w-40 rounded-full">
          Sign In
        </button>
      </div>
      {/* Auth button */}

      <div></div>
    </nav>
  );
};

export default NavbarLanding;
