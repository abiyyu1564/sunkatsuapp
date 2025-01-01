import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import DetailMenu from "./detailMenu";

const FavoriteMenu = () => {
  const [favorites, setFavorites] = useState([]); // State untuk menyimpan data menu favorit
  const [isLoading, setIsLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error
  const [imageURLs, setImageURLs] = useState({});
  const [popupState, setPopupState] = useState({
    showAdd: false,
    showDetail: false,
    selectedMenu: null,
  });

  console.log(favorites);

  const handlePopup = (type, menu = null) => {
    setPopupState((prev) => ({
      ...prev,
      [type]: !prev[type],
      selectedMenu: menu, // Pass the specific menu item
    }));
  };

  const user = jwtDecode(Cookies.get("token"));

  const baseURL = `http://localhost:8080/api/customers/${user.id}/favorites`; // Base URL API favorit

  const getImage = (menuId) => {
    // Jika URL gambar sudah ada di state imageURLs, langsung gunakan
    if (imageURLs[menuId]) {
      return imageURLs[menuId];
    }

    // Jika belum, buat request untuk mendapatkan gambar
    axios
      .get(`http://localhost:8080/api/menus/images/${menuId}`, {
        // Endpoint ini hanya contoh, sesuaikan dengan API yang benar
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const imageURL = URL.createObjectURL(response.data);
        setImageURLs((prev) => ({
          ...prev,
          [menuId]: imageURL, // Update state dengan URL gambar yang diterima
        }));
        console.log(imageURL);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });

    return "default_image_url_here"; // URL default gambar jika gagal fetch
  };

  // Fetch data menu favorit dari API
  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching favorites...");
        const response = await axios.get(baseURL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Token untuk autentikasi
          },
        });
        console.log("Favorites response:", response.data);

        const favoriteMenus = response.data.map((item) => ({
          id: item.menu.id,
          name: item.menu.name,
          price: item.menu.price,
          imageURL: item.menu.imageURL,
          image: item.menu.image,
          desc: item.menu.desc,
        }));

        setFavorites(favoriteMenus); // Simpan data favorit ke state
        setError(null);
      } catch (err) {
        console.error(
          "Error fetching favorites:",
          err.response?.status,
          err.response?.data
        );
        setError("Gagal memuat data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Tampilkan loader jika data sedang dimuat
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-lg text-gray-500">Memuat data...</p>
      </div>
    );
  }

  // Tampilkan error jika ada masalah
  if (error) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap w-fit justify-center gap-6">
      {favorites.length > 0 ? (
        favorites.map((menuItem) => (
          <button
            key={menuItem.id}
            onClick={() => handlePopup("showDetail", menuItem)}
            className="relative w-80 h-48 bg-primary shadow-xl rounded-2xl border-gray-200 border-2 transition-transform transform hover:scale-105 focus:outline-none"
          >
            <img
              src={getImage(menuItem.imageURL.slice(18))}
              alt={menuItem.name}
              className="w-32 h-32 absolute top-14 right-1"
            />
            <div className="absolute text-end top-4 left-4 font-sans">
              <h1 className="text-2xl mb-10 font-semibold text-black">
                {menuItem.name}
              </h1>
              <h1 className="text-2xl font-semibold text-start text-black">
                Rp {menuItem.price.toLocaleString("id-ID")}
              </h1>
            </div>
          </button>
        ))
      ) : (
        <div className="text-center">
          <p className="text-gray-500 text-lg font-semibold mb-4">
            Tidak ada menu favorit yang tersedia.
          </p>
        </div>
      )}
      {popupState.showDetail && (
        <DetailMenu
          menuId={popupState.selectedMenu}
          show={popupState.showDetail}
          onClose={() => handlePopup("showDetail")}
        />
      )}
    </div>
  );
};

export default FavoriteMenu;
