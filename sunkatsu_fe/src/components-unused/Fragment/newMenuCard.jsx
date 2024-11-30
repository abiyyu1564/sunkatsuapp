import React, { useContext, useState } from "react";
import Katsu from "../../assets/curry.png";
import Cart from "../../assets/AddCart.png";
import { GlobalContext } from "../../contexts/GlobalContext";
import { Link } from "react-router-dom";
import EditMenu from "./popupEditMenu";
import DetailMenu from "./detailMenu";

const NewMenuCard = () => {
  const { menu } = useContext(GlobalContext);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [showDetailMenu, setShowDetailMenu] = useState(false);

  const handleAddClick = () => {
    setShowAddPopup(!showAddPopup);
  };

  const handleDetailClick = () => {
    setShowDetailMenu(!showDetailMenu);
  };

  const baseURL = "http://localhost:8080";

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F3F7]">
      <div className="flex flex-wrap gap-32 mt-32 items-center justify-center m-20">
        {menu.length > 0 &&
          menu.map((menuItem) => (
            <button
              className="relative w-64 h-64 bg-gradient-to-br from-red-500 to-65% shadow-xl rounded-2xl"
              onClick={handleDetailClick}
            >
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
            </button>
          ))}
        <DetailMenu show={showDetailMenu} onClose={handleDetailClick} />
      </div>
      <div className="fixed bottom-10 right-10">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-2xl"
          onClick={handleAddClick}
        >
          Tambah data Menu
        </button>
        <EditMenu show={showAddPopup} onClose={handleAddClick} />
      </div>
    </div>
  );
};

export default NewMenuCard;
