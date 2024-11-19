import React, { useContext } from "react";
import { createMenu } from "../../services/crudMenu";
import { GlobalContext } from "../../context/GlobalContext";

const CobaInputMenu = () => {
  const { input, setInput, handleInput } = useContext(GlobalContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    createMenu(input);
  };

  return (
    <form>
      <input type="text" placeholder="name" onChange={handleInput} />
      <input type="text" placeholder="desc" onChange={handleInput} />
      <input type="number" placeholder="price" onChange={handleInput} />
      <input type="file" placeholder="image" onChange={handleInput} />
      <input type="text" placeholder="category" onChange={handleInput} />
      <button onClick={handleSubmit}>Create Menu</button>
    </form>
  );
};

export default CobaInputMenu;
