import React from "react";
import Katsu from "../../assets/katsu.png";

const CustomerHistoryCard = () => {
  return (
    <div className="flex gap-5 mx-10 p-8 border-2 shadow-xl my-5 w-10/12">
      <img src={Katsu} alt="katsu" className="w-40 h-40" />
      <div className="relative w-full px-5">
        <div className="relative ">
          <h1 className="text-2xl font-bold text-[#FF0000]">
            Chicken Katsu Curry & Milkshake
          </h1>
          <p>1 item x 23.000</p>
          <p>1 item x 15.000</p>
          <div className="absolute top-10 text-lg right-0 text-right text-[#FF0000] font-bold">
            <p>Please pay before</p>
            <p>11:00</p>
          </div>
        </div>
      </div>
      <div className="w-0,5 h-36 my-2 flex flex-col justify-center items-center border-2"></div>
      <div className="w-1/3 p-5">
        <h2 className="text-xl font-bold text-[#FF0000]">Total Belanja:</h2>
        <h2 className="text-3xl font-bold text-black">Rp. 38.000</h2>
      </div>
    </div>
  );
};

export default CustomerHistoryCard;
