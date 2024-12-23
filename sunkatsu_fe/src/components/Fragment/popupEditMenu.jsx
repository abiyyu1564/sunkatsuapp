import React, { useState, useContext, useEffect } from "react";
import { ReactComponent as AddImage } from "../Icon/addImage.svg";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const EditMenu = ({ show, onClose, menuId }) => {
  const [selectedImage, setSelectedImage] = useState({});
  const { input, setInput, setFetchStatus, fetchStatus, removeBackground } =
    useContext(GlobalContext);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageURLs, setImageURLs] = useState({});

  console.log(menuId);
  const baseURL = "http://localhost:8080";

  const getImage = (menuId) => {
    // Jika URL gambar sudah ada di state imageURLs, langsung gunakan
    if (selectedImage[menuId]) {
      return selectedImage[menuId];
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
        setSelectedImage((prev) => ({
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

  useEffect(() => {
    if (menuId) {
      axios
        .get(`http://localhost:8080/api/menus/${menuId.id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setInput({
            name: res.data.name,
            desc: res.data.desc,
            price: res.data.price,
            category: res.data.category,
            image: res.data.image,
          });
          setSelectedImage(`${baseURL}` + res.data.imageURL);
          console.log("selectedImage:", selectedImage);
        })
        .catch((err) => {
          console.error("Error fetching menu data:", err);
        });
    }
  }, [menuId]);

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

  const handleInput = (event) => {
    const { name, value } = event.target;

    setInput((prevState) => ({
      ...prevState,
      [name]: value, // Perbarui state berdasarkan `name` field
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const { image, name, desc, price, category } = input;
    console.log("Input for update:", input);

    // Validasi input
    if (!name || !desc || !price || !image || !category) {
      console.error("All fields are required!");
      alert("Please fill in all fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", image);

      // Kirim file ke server untuk update menu
      const response = await axios.put(
        `http://localhost:8080/api/menus/${menuId.id}`, // Gunakan ID menu
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
          params: {
            name,
            price,
            desc,
            category,
            nums_bought: menuId.numsBought,
          },
        }
      );

      console.log("Update response:", response.data);
      setFetchStatus((prevStatus) => !prevStatus);

      // Reset input form setelah update
      setInput({
        id: "",
        name: "",
        desc: "",
        price: "",
        image: null,
        category: "",
      });
      Swal.fire({
        title: "Success!",
        text: "Menu updated successfully.",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error(
        "Error updating menu:",
        error.response?.data || error.message
      );
      alert("Failed to update menu. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className="flex justify-center items-center h-screen fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
      <div className="flex border-secondary border-8 w-8/12 rounded-2xl p-8 bg-white shadow-md gap-8">
        {/* Left Section */}
        <div className="w-1/2 flex flex-col justify-center items-center">
          {selectedImage ? (
            <div className="flex flex-col items-center">
              <img
                src={getImage(menuId.image)}
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
            accept="image/*"
            name="image"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Input for Name */}
          <div>
            <label className="block font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={input.name}
              onChange={handleInput}
              placeholder="Insert Menu Name"
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-secondary"
            />
          </div>
          {/* Input for Price */}
          <div>
            <label className="block font-bold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={input.price}
              onChange={handleInput}
              placeholder="Insert Menu Price"
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-secondary"
            />
          </div>
          {/* Input for Description */}
          <div>
            <label className="block font-bold mb-2">Description</label>
            <input
              type="text"
              name="desc"
              value={input.desc}
              onChange={handleInput}
              placeholder="Insert Menu Description"
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={input.category}
              onChange={handleInput}
              placeholder="Insert Menu Category"
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
              onClick={handleUpdate}
              disabled={isProcessingImage}
            >
              {isProcessingImage ? "Processing..." : "Save Menu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMenu;
