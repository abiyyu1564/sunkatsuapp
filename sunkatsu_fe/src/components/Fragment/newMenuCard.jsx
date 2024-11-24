import React, { useContext } from "react";
import Katsu from "../../assets/curry.png";
import Cart from "../../assets/AddCart.png";
import { GlobalContext } from "../../context/GlobalContext";
import { Link } from "react-router-dom";

const NewMenuCard = () => {
  const { menu } = useContext(GlobalContext);

  const baseURL = "http://localhost:8080";

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F3F7]">
      <div className="flex flex-wrap gap-32 mt-32 items-center justify-center m-20">
        {menu.length > 0 &&
          menu.map((menuItem) => (
            <div className="relative w-64 h-64 bg-gradient-to-br from-red-500 to-65% shadow-xl rounded-2xl">
              <img
                src={`${baseURL}${menuItem.imageURL}`}
                alt="katsu"
                className="w-48 h-48 absolute -top-20 left-8"
              />
              <img
                src={Cart}
                alt="cart"
                className="absolute w-14 h-14 -top-7 -right-7"
              />
              <div className="absolute text-end bottom-4 right-4 font-sans">
                <h1 className="text-2xl mb-10 font-semibold text-black">
                  {menuItem.name}
                </h1>

                <h1 className="text-2xl font-semibold text-black">
                  {menuItem.price}
                </h1>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NewMenuCard;
