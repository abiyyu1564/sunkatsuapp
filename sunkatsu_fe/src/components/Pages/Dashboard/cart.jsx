import React, { useState } from "react";
import Navbar from "../../Fragment/Navbar";
import NewFooter from "../../Fragment/newFooter";
import Katsu from "../../../assets/NewLanding_Katsu.png";
import { ReactComponent as Plus } from "../../Icon/Plus.svg";
import { ReactComponent as Minus } from "../../Icon/Minus.svg";

const Cart = () => {
  // Array to manage the quantity for each cart item
  const [quantities, setQuantities] = useState([1, 1, 1]); // Initial quantities for 3 items

  // Increment function
  const increment = (index) => {
    const newQuantities = [...quantities];
    newQuantities[index] += 1; // Increment the quantity for the given index
    setQuantities(newQuantities);
  };

  // Decrement function
  const decrement = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 1) {
      newQuantities[index] -= 1; // Decrement the quantity for the given index
      setQuantities(newQuantities);
    } else {
        alert('Remove menu from cart');
        newQuantities[index] = 0;
        setQuantities(newQuantities);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-primary">
      <Navbar />
      <main className="flex flex-grow flex-col justify-start items-center gap-1/2">
        <div className="flex h-16 w-full sm:w-5/6 justify-start items-center px-5 rounded-t-lg bg-tertiary">
          <h1 className="text-xl sm:text-2xl text-white">Your Cart</h1>
        </div>

        <div className="flex flex-col w-full sm:w-5/6 justify-center items-center gap-5 py-5">
          {Array(3).fill().map((_, index) => (
            <section key={index} className="flex w-full h-auto justify-center items-center bg-white">
              <div className="flex flex-col sm:flex-row w-full gap-5 sm:w-5/6 h-fit justify-between items-center p-5">
                <input
                  type="checkbox"
                  value=""
                  className="w-10 h-10 rounded-md border-1 text-secondary border-black"
                />
                <img src={Katsu} alt="katsu" className="w-32 h-32" />
                <h1 className="text-3xl sm:text-4xl font-semibold">Chicken Curry Katsu</h1>
                <div className="flex flex-col w-48 sm:w-60 h-fit justify-center items-center gap-3">
                  <h1 className="text-3xl font-medium text-black">15.000</h1>
                  <div className="flex flex-row w-3/4 h-fit items-center justify-between p-2 rounded-full border-4 border-black">
                    <button
                      type="button"
                      onClick={() => decrement(index)} // Decrement when clicked
                      className="flex w-8 h-8 rounded-full justify-center items-center bg-secondary"
                    >
                      <Minus className="w-4 h-8" />
                    </button>
                    <h4 className="text-2xl font-medium text-black">{quantities[index]}</h4>
                    <button
                      type="button"
                      onClick={() => increment(index)} // Increment when clicked
                      className="flex w-8 h-8 rounded-full justify-center items-center bg-secondary"
                    >
                      <Plus className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="flex h-16 w-full sm:w-5/6 justify-between items-center px-5 mb-5 rounded-b-lg bg-tertiary">
          <div className="flex flex-col justify-start items-center">
            <h2 className="text-sm mr-9 text-white">Total items</h2>
            <h1 className="text-2xl text-white">Total Price</h1>
          </div>
          <div className="flex">
            <div className="flex w-32 sm:w-40 h-8 justify-center items-center rounded-md p-2 bg-secondary">
                <a
                type="submit"
                href="/payment"
                className="text-lg font-bold text-white">
                  Pay Now!
              </a>
            </div>
          </div>
        </div>
      </main>
      <NewFooter />
    </div>
  );
};

export default Cart;
