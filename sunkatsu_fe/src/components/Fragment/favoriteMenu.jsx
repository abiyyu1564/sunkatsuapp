import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const FavoriteMenu = () => {
  const [favorites, setFavorites] = useState([]); // State untuk menyimpan data menu favorit
  const [isLoading, setIsLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error

  const user = jwtDecode(Cookies.get("token"));

  const baseURL = `http://localhost:8080/api/customers/${user.id}/favorites`; // Base URL API favorit

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
          <div
            key={menuItem.id}
            className="relative w-80 h-48 bg-primary shadow-xl rounded-2xl border-gray-200 border-2 transition-transform transform hover:scale-105 focus:outline-none"
          >
            <img
              src={menuItem.imageURL}
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
          </div>
        ))
      ) : (
        <div className="text-center">
          <p className="text-gray-500 text-lg font-semibold mb-4">
            Tidak ada menu favorit yang tersedia.
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoriteMenu;
