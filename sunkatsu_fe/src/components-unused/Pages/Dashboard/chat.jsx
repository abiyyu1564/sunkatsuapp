import React from "react";
import Navbar from "../../Fragments/Navbar";
import { ReactComponent as SendIcon } from "../../Icon/Send.svg";

const Chat = () => {
  return (
    <>
      <div className="bg-primary min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto mt-8 pb-20">

          <div className="bg-secondary text-white p-4 rounded-t-xl">
            <h1 className="text-2xl font-bold">Sunkatsu</h1>
          </div>


          <div className="bg-white p-6 space-y-6 pb-24">

            <div className="flex gap-4 items-start max-w-[80%]">
              <div className="bg-gray-200 rounded-2xl px-4 py-2">
                <p>Hi</p>
              </div>
            </div>


            <div className="flex gap-4 items-start justify-end">
              <div className="bg-gray-200 rounded-2xl px-4 py-2">
                <p>Halo</p>
              </div>
            </div>
          </div>


          <div className="fixed bottom-5 w-full max-w-7xl px-4">
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-lg">
              <input
                placeholder="Send messages..."
                className="w-full border border-black rounded-lg pl-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary hover:bg-red-300 cursor-pointer">
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <SendIcon className="w-5 h-5 text-white ml-[5px]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
