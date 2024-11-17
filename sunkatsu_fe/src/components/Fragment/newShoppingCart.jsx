import React from "react";
import Katsu from "../../assets/curry.png";
import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleMinus } from "react-icons/fa6";

const NewShoppingCart = () => {
  return (
    <>
      <div className="flex w-5/6 mx-auto items-center justify-between">
        <input type="checkbox" className="w-8 h-8 rounded-sm" />
        <img src={Katsu} alt="katsu" className="w-40 h-40" />
        <h1 className="text-4xl font-semibold">Chicken Katsu Curry</h1>
        <div>
          <h2 className="text-2xl font-semibold">Rp. 15.000</h2>
          <div className="flex w-fit h-fit gap-4 border-black border-2 rounded-2xl p-2">
            <FaCircleMinus size={30} color="red" />
            <h2 className="text-2xl text-center font-semibold">1</h2>
            <FaCirclePlus size={30} color="red" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewShoppingCart;
