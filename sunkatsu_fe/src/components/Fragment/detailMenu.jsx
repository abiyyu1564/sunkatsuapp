import React, { useState } from "react";
import Katsu from "../../assets/curry.png";

const DetailMenu = ({ show, onClose, menuId }) => {
  console.log(menuId);

  const baseURL = "http://localhost:8080";

  if (!show) return null;
  return (
    <div className="flex justify-center  items-center h-screen fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
      <div className="flex border-secondary border-8 gap-5 w-7/12 rounded-2xl p-6 bg-white shadow-md">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col items-center">
          <h1 className="font-bold text-2xl mb-6 text-black">{menuId.name}</h1>
          <img
            src={`${baseURL}${menuId.imageURL}`}
            alt="katsu"
            className="w-48 h-48  rounded-full"
          />
        </div>

        <div className="w-1/2 flex flex-col justify-evenly">
          <p className="text-sm text-gray-700  leading-relaxed">
            {menuId.desc}
          </p>
          <div>
            <h2 className="text-secondary mb-6 font-bold text-2xl">
              {menuId.price}
            </h2>
          </div>
          <input
            type="text"
            placeholder="Note..."
            name="note"
            className="border-2 border-gray-300 rounded-md p-2"
          />
          <div className="flex justify-end gap-4 mt-4">
            <button className="bg-secondary hover:bg-red-700 transition w-40 mt-6 h-10 text-white font-bold text-sm rounded-md self-end">
              Add to Cart
            </button>
            <button
              className="bg-black h-10 w-40 mt-6 text-white font-bold py-2 px-6 rounded-md hover:opacity-90"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMenu;
