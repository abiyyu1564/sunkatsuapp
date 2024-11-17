import React, { useState } from "react";
import axios from "axios";

function RemoveBackground() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);

  // Fungsi untuk menangani perubahan file input
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  // Fungsi untuk menghapus background gambar
  const removeBackground = async () => {
    if (!selectedImage) {
      alert("Silakan unggah gambar terlebih dahulu");
      return;
    }

    const formData = new FormData();
    formData.append("image_file", selectedImage);
    formData.append("size", "auto");

    const api_key = "thRZjco6HahxbEPxoWdQi5JU";

    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            "X-Api-Key": api_key, // Ganti dengan API Key Anda
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const outputUrl = URL.createObjectURL(response.data);
      setOutputImage(outputUrl);
    } catch (error) {
      console.error("Error menghapus background:", error);
      alert("Gagal menghapus background");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Hapus Background Gambar</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={removeBackground}>Hapus Background</button>

      {selectedImage && (
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Input"
          width="200px"
        />
      )}
      {outputImage && (
        <div>
          <h3>Hasil:</h3>
          <img src={outputImage} alt="Tanpa Background" width="200px" />
        </div>
      )}
    </div>
  );
}

export default RemoveBackground;
