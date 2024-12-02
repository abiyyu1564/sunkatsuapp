import React, { useContext, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";

const api_key = "thRZjco6HahxbEPxoWdQi5JU";

const fetchBlob = async (url) => {
  const response = await fetch(url); // Unduh file dari URL
  const blob = await response.blob(); // Konversi response ke Blob
  return blob;
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

const CobaInputMenu = () => {
  const { input, setInput, setFetchStatus, fetchStatus } =
    useContext(GlobalContext);

  const [isProcessingImage, setIsProcessingImage] = useState(false); // Flag untuk melacak status penghapusan background

  const handleInput = async (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      const file = files[0];

      // Validasi tipe file (opsional)
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Please upload a valid image (JPEG/PNG).");
        return;
      }

      try {
        setIsProcessingImage(true); // Mulai proses penghapusan background

        // Hapus background dari file yang diunggah
        const fileWithoutBg = await removeBackground(file);

        // Simpan file ke state
        setInput((prevState) => ({
          ...prevState,
          image: fileWithoutBg,
        }));

        console.log("Background removed successfully.");
      } catch (error) {
        console.error("Failed to remove background:", error);
        alert("Failed to remove background. Please try again.");
      } finally {
        setIsProcessingImage(false); // Selesai proses penghapusan background
      }
    } else if (name === "image_url") {
      try {
        setIsProcessingImage(true); // Mulai proses pengunduhan dan penghapusan background

        // Unduh file dari URL
        const blob = await fetchBlob(value);
        const file = new File([blob], "image.png", { type: blob.type });

        // Hapus background dari file yang diunduh
        const fileWithoutBg = await removeBackground(file);

        // Simpan file ke state
        setInput((prevState) => ({
          ...prevState,
          image: fileWithoutBg,
        }));

        console.log("Image downloaded and background removed successfully.");
      } catch (error) {
        console.error("Error processing image:", error);
        alert("Failed to process the image. Please try again.");
      } finally {
        setIsProcessingImage(false); // Selesai proses
      }
    } else {
      // Untuk input lain
      setInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { image, name, desc, price, category } = input;
    console.log("Input:", input);

    // Validasi input
    if (!name || !desc || !price || !image || !category) {
      console.error("All fields are required!");
      alert("Please fill in all fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", image);

      // Kirim file ke server
      const response = await axios.post(
        "http://localhost:8080/api/menus",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            name,
            desc,
            price,
            category,
            nums_bought: 0,
          },
        }
      );

      console.log("response:", response.data);
      setFetchStatus((prevStatus) => !prevStatus);

      // Reset input form setelah submit
      setInput({
        name: "",
        desc: "",
        price: "",
        image: null,
        category: "",
      });
      window.location.reload();
    } catch (error) {
      console.error(
        "Error creating menu:",
        error.response?.data || error.message
      );
      alert("Failed to create menu. Please try again.");
    }
  };

  return (
    <form>
      <input
        type="text"
        name="name"
        placeholder="name"
        onChange={handleInput}
      />
      <input
        type="number"
        name="price"
        placeholder="price"
        onChange={handleInput}
      />
      <input
        type="text"
        name="desc"
        placeholder="desc"
        onChange={handleInput}
      />
      <input
        type="file"
        name="image"
        placeholder="image"
        onChange={handleInput}
      />
      <input
        type="text"
        name="category"
        placeholder="category"
        onChange={handleInput}
      />
      <button
        onClick={handleSubmit}
        disabled={isProcessingImage} // Nonaktifkan tombol saat proses berlangsung
      >
        {isProcessingImage ? "Processing..." : "Create Menu"}
      </button>
    </form>
  );
};

export default CobaInputMenu;
