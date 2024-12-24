import React, { useEffect, useState, useContext } from "react";
import Cart from "../../assets/AddCart.png";
import { GlobalContext } from "../../context/GlobalContext";

const FavoriteMenu = () => {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = "http://localhost:8080";

  const { getUser } = useContext(GlobalContext);
  const [popupState, setPopupState] = useState({
    showDetail: false,
    selectedMenu: null,
  });

  const dummyMenu = [
    {
      id: 1,
      name: "Nasi Goreng",
      price: 15000,
      imageURL: "/images/nasi-goreng.jpg",
      timesBought: 120,
    },
    {
      id: 2,
      name: "Jello Pudding",
      price: 10000,
      imageURL: "/images/jello-pudding.jpg",
      timesBought: 90,
    },
    {
      id: 3,
      name: "Ice Lychee Tea",
      price: 12000,
      imageURL: "/images/ice-lychee-tea.jpg",
      timesBought: 150,
    },
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Simulasi data dummy
        setMenu(dummyMenu);
        setError(null);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError("Belum ada menu favorite.");
        setMenu(dummyMenu);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handlePopup = (type, menu = null) => {
    setPopupState((prev) => ({
      ...prev,
      showDetail: type === "showDetail" ? !prev.showDetail : prev.showDetail,
      selectedMenu: menu,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-lg text-gray-500">Memuat menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {menu.length > 0 ? (
        menu.map((menuItem) => (
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
                Rp {menuItem.price.toLocaleString("id-ID")}
              </h1>
            </div>
          </button>
        ))
      ) : (
        <p className="text-gray-500 text-lg font-semibold">
          Tidak ada menu favorite.
        </p>
      )}


      {popupState.showDetail && popupState.selectedMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {popupState.selectedMenu.name}
            </h2>
            <img
              src={`${baseURL}${popupState.selectedMenu.imageURL}`}
              alt={popupState.selectedMenu.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-lg font-semibold text-gray-700">
              Harga: Rp {popupState.selectedMenu.price.toLocaleString("id-ID")}
            </p>
            <button
              onClick={() => handlePopup("showDetail")}
              className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600"
            >
              Tutup
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteMenu;