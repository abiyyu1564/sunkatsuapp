import React, { useContext } from "react";
import Katsu from "../../assets/katsu.png";
import { GlobalContext } from "../../contexts/GlobalContext";

const Card = ({ showPrice }) => {
  const { menu } = useContext(GlobalContext);

  console.log(menu);

  return (
    <div>
      {menu.length > 0 &&
        menu.map((menuItem) => (
          <div
            key={menuItem.id}
            className="flex flex-col items-center border-2 rounded-lg p-2 w-64 h-96 m-5 shadow-lg"
          >
            <img src={Katsu} alt="katsu" className="w-48 h-48 mb-2" />
            <h1 className="font-bold text-[#FF0000] text-lg m-2">
              {menuItem.name}
            </h1>
            {showPrice && (
              <h2 className="font-bold text-[#FF0000] text-md m-2">
                {menuItem.price}
              </h2>
            )}
            <p className="text-md m-2 text-center">{menuItem.desc}</p>
          </div>
        ))}
    </div>
  );
};

export default Card;
