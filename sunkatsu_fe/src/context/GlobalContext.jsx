import { createContext, useEffect, useState } from "react";
import { getAllMenu } from "../services/crudMenu";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(true);
  const [decode, setDecode] = useState({});
  const [input, setInput] = useState({
    name: "",
    desc: "",
    price: "",
    image: "",
    category: "",
  });

  const getUser = () => {
    const decode = jwtDecode(Cookies.get("token"));

    return decode;
  };

  useEffect(() => {
    if (fetchStatus) {
      getAllMenu((data) => {
        setMenu(data);
      });
      setFetchStatus(false);
    }
  }, [fetchStatus, setFetchStatus]);

  const formatRupiah = (angka, prefix) => {
    let number_string = angka.toString().replace(/[^,\d]/g, "");
    let split = number_string.split(",");
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      let separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;

    return prefix == null ? rupiah : rupiah ? "Rp " + rupiah : "";
  };

  const api_key = "thRZjco6HahxbEPxoWdQi5JU";
  const handleInput = async (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      const file = files[0];

      // Validate file type (optional)
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Please upload a valid image (JPEG/PNG).");
        return;
      }

      try {
        // Prepare FormData
        const formData = new FormData();
        formData.append("image_file", file);
        formData.append("size", "auto");

        // Send request to Remove.bg
        const response = await axios.post(
          "https://api.remove.bg/v1.0/removebg",
          formData,
          {
            headers: {
              "X-Api-Key": api_key, // Only the API key is needed
            },
            responseType: "blob",
          }
        );

        // Convert Blob to URL
        const imageWithoutBg = URL.createObjectURL(response.data);

        // Update state with the new image
        setInput((prevState) => ({
          ...prevState,
          image: imageWithoutBg,
        }));
        console.log("Berhasil menghapus background");
      } catch (error) {
        console.error("Error removing background:", error);
        alert("Failed to process the image. Please try again.");
      }
    } else {
      // For other input types
      setInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const removeBackground = async (file) => {
    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            "X-Api-Key": api_key,
          },
          responseType: "blob", // Agar mendapatkan data gambar dalam format blob
        }
      );

      // Konversi blob hasil API menjadi file baru
      const removedBgBlob = response.data;
      const timestamp = Date.now();
      const removedBgFile = new File(
        [removedBgBlob],
        `image_no_bg_${timestamp}.png`,
        {
          type: removedBgBlob.type,
        }
      );

      return removedBgFile; // File dengan background dihapus
    } catch (error) {
      console.error("Error removing background:", error);
      throw new Error("Failed to remove background.");
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        menu,
        setMenu,
        input,
        setInput,
        fetchStatus,
        setFetchStatus,
        handleInput,
        removeBackground,
        getUser,
        formatRupiah,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
