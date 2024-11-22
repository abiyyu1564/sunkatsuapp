import React, { useContext } from "react";
import axios from "axios";
import { createMenu } from "../../services/crudMenu";
import { GlobalContext } from "../../context/GlobalContext";

const CobaInputMenu = () => {
  const { input, setInput } = useContext(GlobalContext);

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     createMenu(input);
  //   };

  const handleInput = (event) => {
    const { name, value, files } = event.target;

    if (name === "image" && files) {
      setInput({ ...input, [name]: event.target.files[0] });
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { name, desc, price, image, category } = input;

    // Validasi input
    if (!name || !desc || !price || !image || !category) {
      console.error("All fields are required!");
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    axios
      .post("http://localhost:8080/api/menus", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          name,
          desc,
          price,
          category,
          nums_bought: 0, // Tambahkan nums_bought langsung di params
        },
      })
      .then((res) => {
        console.log("response:", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
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
      <button onClick={handleSubmit}>Create Menu</button>
    </form>
  );
};

export default CobaInputMenu;
