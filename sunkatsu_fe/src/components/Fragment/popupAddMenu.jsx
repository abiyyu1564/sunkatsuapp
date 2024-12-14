import React, { useState, useContext } from "react";
import { ReactComponent as AddImage } from "../Icon/addImage.svg";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";
import CobaInputMenu from "./cobaInputMenu";
import Cookies from "js-cookie";

const AddMenu = ({ show, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { input, setInput, setFetchStatus, fetchStatus, removeBackground } =
    useContext(GlobalContext);

  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      try {
        setIsProcessingImage(true);
        const fileWithoutBg = await removeBackground(file); // Proses penghapusan background
        setInput((prevState) => ({
          ...prevState,
          image: fileWithoutBg, // Simpan file tanpa background
        }));
      } catch (error) {
        console.error("Failed to process image:", error);
        alert("Error processing image. Please try again.");
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  // Handle form submission

  const fetchBlob = async (url) => {
    const response = await fetch(url); // Unduh file dari URL
    const blob = await response.blob(); // Konversi response ke Blob
    return blob;
  };

  // Flag untuk melacak status penghapusan background

  const handleInput = (event) => {
    const { name, value } = event.target;

    setInput((prevState) => ({
      ...prevState,
      [name]: value, // Perbarui state berdasarkan `name` field
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { image, name, desc, price, category } = input;

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
            Authorization: `Bearer ${Cookies.get("token")}`,
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
      alert("Menu created successfully!");
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

  if (!show) return null;
  return (
    <div className="flex justify-center items-center mt-8 h-screen fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
      <div className="flex border-secondary border-8 w-8/12 rounded-2xl p-8 bg-white shadow-md gap-8">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col justify-center items-center">
          {selectedImage ? (
            <div className="flex flex-col items-center">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-48 h-48 object-cover rounded-md mb-2"
              />
              <label
                htmlFor="imageInput"
                className="text-secondary font-bold cursor-pointer hover:underline"
              >
                Change Image
              </label>
            </div>
          ) : (
            <label
              htmlFor="imageInput"
              className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
            >
              <AddImage className="w-36 h-36 object-cover" />
              <p className="text-black font-bold text-lg">Add Menu Picture</p>
            </label>
          )}
          <input
            id="imageInput"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex flex-col ">
          {/* Input for Name */}
          <div>
            <label className="block font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Insert Menu Name"
              onChange={handleInput}
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-secondary"
            />
          </div>
          {/* Input for Price */}
          <div>
            <label className="block font-bold mb-2">Price</label>
            <input
              type="number"
              name="price"
              placeholder="Insert Menu Price"
              onChange={handleInput}
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-secondary"
            />
          </div>
          {/* Input for Description */}
          <div>
            <label className="block font-bold mb-2">Description</label>
            <input
              type="text"
              name="desc"
              placeholder="Insert Menu Description"
              onChange={handleInput}
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Category</label>
            <input
              type="text"
              name="category"
              placeholder="Insert Menu Category"
              onChange={handleInput}
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-secondary"
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="bg-black text-white font-bold py-2 px-6 rounded-md hover:opacity-90"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-secondary text-white font-bold py-2 px-6 rounded-md hover:bg-red-700"
              onClick={handleSubmit}
              disabled={isProcessingImage}
            >
              {isProcessingImage ? "Processing..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenu;
