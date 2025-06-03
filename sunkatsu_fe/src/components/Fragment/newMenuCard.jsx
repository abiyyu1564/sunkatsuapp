import React, { useContext, useState, useEffect } from "react";
import Cart from "../../assets/AddCart.png";
import { GlobalContext } from "../../context/GlobalContext";
import AddMenu from "./popupAddMenu";
import DetailMenu from "./detailMenu";
import axios from "axios";
import Cookies from "js-cookie";
import Mines from "../../assets/menu_minus.png";
import Plus from "../../assets/menu_plus.png";

const NewMenuCard = ({ selectedCategory }) => {
  const { menu, getUser, search } = useContext(GlobalContext);
  const [filteredMenu, setFilteredMenu] = useState([]);
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

  useEffect(() => {
    // Filter menu berdasarkan kategori dan keyword pencarian
    let filtered =
      selectedCategory === "All"
        ? menu
        : menu.filter((item) => item.category === selectedCategory);

    if (search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredMenu(filtered);
  }, [menu, selectedCategory, search]);

  console.log(search);

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
      <div className="px-4 py-6">
        {/* Category Title */}
        <div className="max-w-6xl mx-auto mb-6">
          <h2 className="text-4xl font-bold text-gray-800">
            {selectedCategory === "All" ? "All" : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
          </h2>
        </div>

        {/* Menu Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {filteredMenu.length > 0 &&
              filteredMenu.map((menuItem) => (
                <div
                  key={menuItem.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 hover:shadow-md transition-shadow"
                  onClick={() => handlePopup("showDetail", menuItem)}
                >
                  <div className="flex gap-4">
                    <div className="w-56 h-56 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={imageURLs[menuItem.image] || "/placeholder.svg?height=128&width=128"}
                        alt={menuItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{menuItem.name}</h3>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Rp. {menuItem.price.toLocaleString("id-ID")}
                      </p>
                      <p className="text-gray-600 text-sm mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img src={Mines} alt="-" className="w-5 h-5" />
                        </button>
                        <span className="text-lg font-medium">1</span>
                        <button
                          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img src={Plus} alt="+" className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {popupState.showDetail && (
        <DetailMenu
          menuId={popupState.selectedMenu}
          show={popupState.showDetail}
          onClose={() => handlePopup("showDetail")}
        />
      )}

      {user.role === "OWNER" ? (
        <div className="fixed bottom-10 right-10">
          <button
            className="bg-tertiary hover:bg-red-600 text-white font-bold py-2 px-4 rounded-2xl"
            onClick={() => handlePopup("showAdd")}
          >
            Tambah data Menu
          </button>
          {popupState.showAdd && <AddMenu show={popupState.showAdd} onClose={() => handlePopup("showAdd")} />}
        </div>
      ) : (
        <span></span>
      )}
    </div>

    // <div className="flex flex-col min-h-screen">
    //   <div className="flex flex-wrap gap-32 mt-12 items-center justify-center m-20">
    //     {filteredMenu.length > 0 &&
    //       filteredMenu.map((menuItem) => (
    //         <button
    //           key={menuItem.id}
    //           className="relative w-80 h-48 bg-primary shadow-xl rounded-2xl border-gray-200 border-2 transition-transform transform hover:scale-105 focus:outline-none"
    //           onClick={() => handlePopup("showDetail", menuItem)}
    //           aria-label={`View details of ${menuItem.name}`}
    //         >
    //           <img
    //             src={imageURLs[menuItem.image]} // Gunakan URL dari state
    //             alt={menuItem.name}
    //             className="w-32 h-32 absolute top-14 right-1"
    //           />
    //           <img
    //             src={Cart}
    //             alt="Add to cart"
    //             className="absolute w-14 h-14 -top-7 -right-7"
    //           />
    //           <div className="absolute text-start top-4 left-4 mx-0.5 font-sans">
    //             <h1 className="text-2xl mb-10 font-semibold text-black">
    //               {menuItem.name}
    //             </h1>
    //             <h1 className="text-2xl font-semibold text-start text-black">
    //               Rp {menuItem.price.toLocaleString("id-ID")}
    //             </h1>
    //           </div>
    //         </button>
    //       ))}
    //     {popupState.showDetail && (
    //       <DetailMenu
    //         menuId={popupState.selectedMenu}
    //         show={popupState.showDetail}
    //         onClose={() => handlePopup("showDetail")}
    //       />
    //     )}
    //   </div>
    //   {user.role === "OWNER" ? (
    //     <div className="fixed bottom-10 right-10">
    //       <button
    //         className="bg-tertiary hover:bg-red-600 text-white font-bold py-2 px-4 rounded-2xl"
    //         onClick={() => handlePopup("showAdd")}
    //       >
    //         Tambah data Menu
    //       </button>
    //       {popupState.showAdd && (
    //         <AddMenu
    //           show={popupState.showAdd}
    //           onClose={() => handlePopup("showAdd")}
    //         />
    //       )}
    //     </div>
    //   ) : (
    //     <span></span>
    //   )}
    // </div>
  );
};

export default NewMenuCard;
