import React from "react";
import { ReactComponent as WALogo} from "../Icon/Whatsapp.svg";
import { ReactComponent as IGLogo} from "../Icon/Instagram.svg";
import { ReactComponent as EmailLogo} from "../Icon/Email.svg";

const IconLink = ({ href, target, rel, children, className}) => {
  return (
    <a
    href={href}
    target={target || '_blank'}
    rel={rel || 'noopener noreferrer'}
    className={`inline-flex items-center ${className || ''}`}
    >
      {children}
    </a>
  );
};

const NewLandingFooter = () => {
  return (
    <footer className="bg-white w-full rounded-lg shadow pb-10 md:pb-0 px-5">
      <div className="w-full mx-auto p-1 flex sm:flex-row md:items-center md:justify-center gap-4">
        <IconLink href="https://www.whatsapp.com/?lang=id_ID" className="hover: text-blue-500">
          <WALogo className = "w-7 h-7 mt-[2px] mr-[-3px]"/>
        </IconLink>
        <IconLink href="https://www.instagram.com/" className="hover: text-blue-500">
        <IGLogo className = "w-6 h-6"/>
        </IconLink>
        <IconLink href="https://mail.google.com/" className="hover: text-blue-500">
        <EmailLogo className = "w-6 h-6"/>
        </IconLink>
      </div>
      <div className="w-full mx-auto max-w-screen-xl p-1 md:flex md:items-center md:justify-center">
        <span className="text-sm text-gray-500 sm:text-center">2024 <a href="/home" className="hover:underline">Sunkatsu</a>. All Right Reserved.
        </span>
      </div>
    </footer>
  );
};

export default NewLandingFooter;
