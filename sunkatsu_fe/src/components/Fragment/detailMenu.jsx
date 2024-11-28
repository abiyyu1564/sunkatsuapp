import React from "react";
import Katsu from "../../assets/curry.png";

const DetailMenu = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex border-secondary border-8 gap-5 w-7/12 rounded-2xl p-6 bg-white shadow-md">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col items-center">
          <h1 className="font-bold text-2xl mb-6 text-black">
            Chicken Curry Katsu
          </h1>
          <img
            src={Katsu}
            alt="katsu"
            className="w-48 h-48 object-cover rounded-full"
          />
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex flex-col justify-evenly">
          <p className="text-sm text-gray-700 mb-6 leading-relaxed">
            Classic Japanese style homemade curry mixed with our secret spices
            combined with our juicy yet tender katsu will warm your heart.
          </p>
          <div>
            <h2 className="text-secondary font-bold text-2xl">Rp. 15.000</h2>
          </div>
          <button className="bg-secondary hover:bg-red-700 transition w-40 mt-6 h-10 text-white font-bold text-sm rounded-md self-end">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailMenu;
