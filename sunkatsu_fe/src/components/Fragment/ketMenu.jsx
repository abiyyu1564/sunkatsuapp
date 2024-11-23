import React from "react";

const Choice = () => {
  return (
    <div className=" font-sans">
      
      <div className="flex justify-center mt-6">
        <div className="bg-white p-6 shadow-lg rounded-md w-full max-w-4xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-800 font-medium">
                Chicken Curry Katsu <span className="text-[#8E0808]">(1x)</span>
              </p>
              <p className="text-gray-800 font-medium">
                Lychee Tea <span className="text-[#8E0808]">(1x)</span>
              </p>
              <p className="text-gray-800 font-medium">
                Oreo Ice Cream Cake <span className="text-[#8E0808]">(1x)</span>
              </p>
            </div>
            <div>
                <p className="text-lg">15 November 2024</p>
            </div>
            <div>
              <p className="text-2xl px-5 font-semibold text-gray-800">33.000</p>
              <span className="bg-[#8E0808] text-white px-5 py-1 text-sm rounded-md">
              In Progress
            </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choice;
