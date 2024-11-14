import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import Logo from "../../assets/logo_load.png";

const Sign = () => { 
    return (
        <div className="bg-[#FF0000] h-screen flex flex-col justify-center items-center">
            <img src={Logo} className="h-[180px] w-[180px]" alt="Logo" />
            <div className="flex flex-col items-center space-y-3">              
                <h1 className="text-white text-xl">Create your account</h1>
                
                <div className="bg-[#FF0000] border border-white rounded-lg p-3 w-full max-w-xs">
                    <form className="space-y-3">
                        <div className="relative">
                            <FaUser className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500 text-sm" />
                                <input 
                                    type="text" 
                                    placeholder="Username" 
                                    className="pl-8 py-2 w-full text-gray-900 bg-gray-50 rounded-full border-0 text-sm focus:outline-none"
                                    required 
                                />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500 text-sm" />
                            <input 
                            type="password" 
                            placeholder="Password" 
                            className="pl-8 py-2 w-full text-gray-900 bg-gray-50 rounded-full border-0 text-sm "
                            required 
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500 text-sm" />
                            <input 
                            type="repeat" 
                            placeholder="Repeat your password" 
                            className="pl-8 py-2 w-full text-gray-900 bg-gray-50 rounded-full border-0 text-sm "
                            required 
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            <button 
                                type="sign in" 
                                className="w-[120px] py-1 text-gray-900 bg-gray-50 rounded-full text-sm "
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                
                </div>
                                    
             </div>

        </div>
    );
}

export default Sign;