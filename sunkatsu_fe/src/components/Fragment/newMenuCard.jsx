import React, { useContext, useState } from "react";
import Cart from "../../assets/AddCart.png";
import { GlobalContext } from "../../context/GlobalContext";
import AddMenu from "./popupAddMenu";
import DetailMenu from "./detailMenu";

const NewMenuCard = ({ selectedCategory }) => {
  const { menu, getUser } = useContext(GlobalContext);
  const [showDetailMenu, setShowDetailMenu] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [popupState, setPopupState] = useState({
    showAdd: false,
    showDetail: false,
    selectedMenu: null,
  });

  const handlePopup = (type, menu = null) => {
    setPopupState((prev) => ({
      ...prev,
      [type]: !prev[type],
      selectedMenu: menu,
    }));
  };

  const handleDetailClick = (menu) => {
    setShowDetailMenu(!showDetailMenu);
    setSelectedMenuItem(menu);
  };

  if (selectedCategory === "Food") {
    selectedCategory = "food";
  } else if (selectedCategory === "Drink") {
    selectedCategory = "drink";
  } else if (selectedCategory === "Dessert") {
    selectedCategory = "dessert";
  }

  const filteredMenu =
    selectedCategory === "All"
      ? menu
      : menu.filter((item) => item.category === selectedCategory);

  const baseURL = "http://localhost:8080";
  console.log(selectedCategory);
  console.log(filteredMenu);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-wrap gap-32 mt-12 items-center justify-center m-20">
        {
          filteredMenu.length > 0 &&
            filteredMenu.map((menuItem) => (
              <button
                key={menuItem.id}
                className="relative w-64 h-64 bg-gradient-to-br from-red-500 to-65% shadow-xl rounded-2xl transition-transform transform hover:scale-105 focus:outline-none"
                onClick={() => handlePopup("showDetail", menuItem)}
                aria-label={`View details of ${menuItem.name}`}
              >
                <img
                  src={`${baseURL}${menuItem.imageURL}`}
                  alt={menuItem.name}
                  className="w-48 h-48 absolute -top-20 left-8"
                />
                <img
                  src={Cart}
                  alt="Add to cart"
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
            ))
          // ) : (
          //   <p className="text-gray-500 text-lg font-semibold">
          //     No menu items available. Click "Tambah data Menu" to add some!
          //   </p>
          // )
        }
        {popupState.showDetail && (
          <DetailMenu
            menuId={popupState.selectedMenu}
            show={popupState.showDetail}
            onClose={() => handlePopup("showDetail")}
          />
        )}
      </div>
      <div className="fixed bottom-10 right-10">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-2xl"
          onClick={() => handlePopup("showAdd")}
        >
          Tambah data Menu
        </button>
        {popupState.showAdd && (
          <AddMenu
            show={popupState.showAdd}
            onClose={() => handlePopup("showAdd")}
          />
        )}
      </div>
    </div>
  );
};

export default NewMenuCard;
