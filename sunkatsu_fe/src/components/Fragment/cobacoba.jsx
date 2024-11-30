import React, { useState } from "react";
import Cart from "../../assets/AddCart.png";
import Edit from "../../assets/Edit.png";

const CobaCoba = () => {
  const [role, setRole] = useState("customer");

  const changeRole = () => {
    if (role === "customer") {
      setRole("admin");
    } else {
      setRole("customer");
    }
  };

  return (
    <>
      <button onClick={changeRole}>Change Role</button>
      {role === "customer" ? (
        <img src={Cart} alt="cart" />
      ) : (
        <img src={Edit} alt="edit" />
      )}
    </>
  );
};

export default CobaCoba;
