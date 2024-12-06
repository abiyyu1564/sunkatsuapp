import React, { useState } from "react";
import Katsu from "../../assets/katsu.png";

const MenuDetail = () => {
  const [count, setCount] = useState(0);
  const counterPlus = () => {
    setCount(count + 1);
  };

  const counterMinus = () => {
    setCount(count - 1);
  };

  if (!show) return null;

  return (
    <div className="w-2/3 mx-10 my-10 p-10 flex gap-10 justify-between">
      <img src={Katsu} alt="katsu" className="w-56 h-56" />
      <div>
        <h1 className="text-3xl font-bold text-[#FF0000]">
          Chicken Katsu Curry
        </h1>
        <p className="">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed ipsum
          quibusdam animi facere dolores quasi omnis doloribus dignissimos
          magnam dolore debitis eveniet, harum autem perspiciatis. Blanditiis
          adipisci autem est dicta.
        </p>
        <h2 className="text-xl font-bold text-[#FF0000] mt-2">Rp. 15.000</h2>
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={counterMinus}
            className="bg-[#FF0000] text-xl flex justify-center items-center w-8 h-8 text-white font-bold rounded-full"
          >
            -
          </button>
          <h2 className="text-xl font-bold text-[#FF0000]">{count}</h2>
          <button
            onClick={counterPlus}
            className="bg-[#FF0000] text-xl flex justify-center items-center w-8 h-8 text-white font-bold rounded-full"
          >
            +
          </button>
        </div>
        <input
          type="text"
          className="w-3/4 bg-red-400 text-md py-1 px-3 font-bold rounded-lg text-white mt-2 placeholder:text-white"
          placeholder="Add Note..."
        />
      </div>
    </div>
  );
};

export default MenuDetail;
