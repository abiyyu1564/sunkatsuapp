import React from "react";
import Logo from "../../assets/logo_load.png";

const Loading = () => { 
    return (
        <div className="bg-[#FF0000] h-screen flex justify-center items-center">
            <img src={Logo} className="h-64 w-64" alt="Logo" />
        </div>
    );
}

export default Loading;