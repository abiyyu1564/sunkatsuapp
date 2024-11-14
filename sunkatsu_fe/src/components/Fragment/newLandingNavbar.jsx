import React from "react";
import Logo from "../../assets/logoLanding.png";
import nameimg from "../../assets/SUNKATSU_hitam.png";
import { LuSearch } from "react-icons/lu";
import { IoChatbubblesOutline } from "react-icons/io5";
import { CiShoppingCart } from "react-icons/ci";
import { GoBell } from "react-icons/go";
import { VscAccount } from "react-icons/vsc";

const NewLandingNavbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 m-5">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-1">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3">
          <img src={Logo} className="h-12 w-12" alt="Logo" />
          <span className="text-2xl font-semibold whitespace-nowrap dark:text-white">
            <img src={nameimg} className="h-9 w-48" alt="Sunkatsu" />
          </span>
        </a>
        <div className="flex gap-10">
          <h1 className="font-sans font-semibold text-3xl">Home</h1>
          <h1 className="font-sans font-semibold text-3xl">Menu</h1>
        </div>
        <div className="flex justify-between w-1/4">
          <div className=" flex gap-5 py-1">
            <LuSearch size={40} />
            <IoChatbubblesOutline size={40} />
            <CiShoppingCart size={40} />
            <GoBell size={40} />
          </div>
          <div>
            <VscAccount size={50} />
          </div>
        </div>
      </div>
      {/* Auth button */}

      <div></div>
    </nav>
  );
};

export default NewLandingNavbar;
