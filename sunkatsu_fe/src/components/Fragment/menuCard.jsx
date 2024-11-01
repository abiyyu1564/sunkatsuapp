import React from "react";
import Katsu from "../../assets/katsu.png";

const Card = (props) => {
  const displayPrice = () => {
    if (props.price === 1) {
      return "Rp. 15.000";
    } else {
      return;
    }
  };
  return (
    <div className="flex flex-col items-center border-2 rounded-lg p-2 w-85 h-84 m-5 shadow-lg">
      <img src={Katsu} alt="katsu" className="w-72 h-72 mb-2" />
      <h1 className="font-bold text-[#FF0000] text-lg m-2">Katsu</h1>
      <h2 className="font-bold text-[#FF0000] text-md m-2">Rp. 15.000</h2>
    </div>
  );
};

export default Card;
