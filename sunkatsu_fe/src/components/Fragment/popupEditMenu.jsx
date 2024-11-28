import React, { useState } from "react";
import { ReactComponent as AddImage } from "../Icon/addImage.svg";

const EditMenu = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
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
            accept="image/*"
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
              placeholder="Insert Menu Name"
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-secondary"
            />
          </div>
          {/* Input for Price */}
          <div>
            <label className="block font-bold mb-2">Price</label>
            <input
              type="number"
              placeholder="Insert Menu Price"
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-secondary"
            />
          </div>
          {/* Input for Description */}
          <div>
            <label className="block font-bold mb-2">Description</label>
            <input
              type="text"
              placeholder="Insert Menu Description"
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-secondary"
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Category</label>
            <input
              type="text"
              placeholder="Insert Menu Category"
              className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-secondary"
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button className="bg-black text-white font-bold py-2 px-6 rounded-md hover:opacity-90">
              Cancel
            </button>
            <button className="bg-secondary text-white font-bold py-2 px-6 rounded-md hover:bg-red-700">
              Save Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMenu;
