import React from "react";
import ig from "../../assets/ig.png";
import wa from "../../assets/WA.png";
import email from "../../assets/email.png";

const Footer = () => {
  return (
    <div className="bg-[#FF0000] flex flex-col items-center p-1 ">
      <h2 className="text-white font-bold text-xl m-3">Contact Us</h2>
      <div className="flex gap-20">
        <img src={ig} alt="instagram" />
        <img src={wa} alt="whatsapp" />
        <img src={email} alt="email" />
      </div>
      <h2 className="text-white font-bold text-xl m-3">
        Copyright © 2022 Sunkatsu. All rights reserved.
      </h2>
    </div>
  );
};

export default Footer;
