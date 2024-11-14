import React from "react";
import { PiWhatsappLogo } from "react-icons/pi";
import { SlSocialInstagram } from "react-icons/sl";
import { IoMailOutline } from "react-icons/io5";

const NewLandingFooter = () => {
  return (
    <footer className="bg-white text-white p-4">
      <div className="flex flex-col justify-center items-center space-x-4">
        <div className="flex text-black font-bold gap-10">
          <PiWhatsappLogo size={30} />
          <SlSocialInstagram size={25} />
          <IoMailOutline size={30} />
        </div>
        <p className="text-black text-xl font-semibold">
          © 2024 Copyright. All rights reserved{" "}
        </p>
      </div>
    </footer>
  );
};

export default NewLandingFooter;
