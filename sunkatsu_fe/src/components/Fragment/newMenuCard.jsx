import React, { useContext, useState, useEffect } from "react";
import Cart from "../../assets/AddCart.png";
import { GlobalContext } from "../../context/GlobalContext";
import AddMenu from "./popupAddMenu";
import DetailMenu from "./detailMenu";
import axios from "axios";
import Cookies from "js-cookie";

const NewMenuCard = ({ selectedCategory }) => {
  const { menu, getUser } = useContext(GlobalContext);
  const [popupState, setPopupState] = useState({
    showAdd: false,
    showDetail: false,
    selectedMenu: null,
  });

  const [imageURLs, setImageURLs] = useState({});

  const handlePopup = (type, menu = null) => {
    setPopupState((prev) => ({
      ...prev,
      [type]: !prev[type],
      selectedMenu: menu,
    }));
  };

  const user = getUser();

  // Menyesuaikan nama kategori
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

  // Fetch gambar secara dinamis
  useEffect(() => {
    const fetchImages = async () => {
      const newImageURLs = {};
      for (const item of filteredMenu) {
        try {
          const response = await axios.get(
            `${baseURL}/api/menus/images/${item.image}`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
              responseType: "blob", // Mengambil sebagai Blob
            }
          );
          const imageURL = URL.createObjectURL(response.data);
          newImageURLs[item.image] = imageURL;
        } catch (error) {
          console.error(`Error fetching image for ${item.name}:`, error);
        }
      }
      setImageURLs(newImageURLs);
    };

    if (filteredMenu.length > 0) {
      fetchImages();
    }
  }, [filteredMenu]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-wrap gap-32 mt-12 items-center justify-center m-20">
        {filteredMenu.length > 0 &&
          filteredMenu.map((menuItem) => (
            <button
              key={menuItem.id}
              className="relative w-64 h-64 bg-gradient-to-br from-red-500 to-65% shadow-xl rounded-2xl transition-transform transform hover:scale-105 focus:outline-none"
              onClick={() => handlePopup("showDetail", menuItem)}
              aria-label={`View details of ${menuItem.name}`}
            >
              <img
                src={imageURLs[menuItem.image]} // Gunakan URL dari state
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
          ))}
        {popupState.showDetail && (
          <DetailMenu
            menuId={popupState.selectedMenu}
            show={popupState.showDetail}
            onClose={() => handlePopup("showDetail")}
          />
        )}
      </div>
      {user.role === "OWNER" ? (
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
      ) : (
        <span></span>
      )}
    </div>
  );
};

export default NewMenuCard;
