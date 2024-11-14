import React, { useContext } from "react";
import Katsu from "../../assets/curry.png";
import { GlobalContext } from "../../context/GlobalContext";

const NewMenuCard = () => {
  const { menu } = useContext(GlobalContext);
  console.log(menu);
  return (
    <div className="flex items-center justify-center m-20">
      {menu.length > 0 &&
        menu.map((menuItem) => (
          <div className="relative w-64 h-64 bg-gradient-to-br from-red-500 to-65% shadow-xl rounded-2xl">
            <img
              src={Katsu}
              alt="katsu"
              className="w-48 h-48 absolute -top-16 left-8"
            />
            <div className="absolute bottom-4 right-4 font-sans">
              <h1 className="text-2xl font-semibold text-black">
                {menuItem.name}
              </h1>
              <h1 className="text-3xl font-semibold text-black">
                {menuItem.price}
              </h1>
            </div>
          </div>
        ))}
    </div>
  );
};

export default NewMenuCard;
