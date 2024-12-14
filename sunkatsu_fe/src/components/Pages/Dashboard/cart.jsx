import React, { useEffect, useState } from "react";
import Navbar from "../../Fragment/Navbar";
import NewFooter from "../../Fragment/newFooter";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ReactComponent as Plus } from "../../Icon/Plus.svg";
import { ReactComponent as Minus } from "../../Icon/Minus.svg";

const Cart = () => {
  const [cart, setCart] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const id = jwtDecode(Cookies.get("token")).id;
  const token = Cookies.get("token");

  console.log(jwtDecode(Cookies.get("token")));

  // Fetch cart items dari API
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/customers/${id}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCartItems(res.data.cartItems); // Simpan data API ke state
        setCart(res.data);
      })
      .catch((err) => console.error("Error fetching cart data:", err));
  }, [id]);

  console.log(cart.id);
  // Fungsi Increment
  const increment = (index) => {
    const updatedCart = cartItems.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: item.quantity + 1 }; // Tambahkan kuantitas hanya untuk item ini
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  // Fungsi Decrement
  const decrement = (index) => {
    const updatedCart = cartItems.map((item, i) => {
      if (i === index && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 }; // Kurangi kuantitas jika > 1
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const handleFinishCart = () => {
    alert("Finish Cart?");
    axios
      .post(
        `http://localhost:8080/api/carts/${cart.id}`,
        {}, // Data yang dikirim, jika ada
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      )
      .catch((err) => console.error("Error finishing cart:", err));
  };

  console.log(token);
  return (
    <div className="flex flex-col min-h-screen pt-20 bg-primary">
      <Navbar />

      <main className="flex flex-grow flex-col justify-start items-center gap-1/2">
        <div className="flex h-16 w-full sm:w-5/6 justify-start items-center px-5 rounded-t-lg bg-tertiary">
          <h1 className="text-xl sm:text-2xl text-white">Your Cart</h1>
        </div>

        <div className="flex flex-col w-full sm:w-5/6 justify-center items-center gap-5 py-5">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <section
                key={item.id}
                className="flex w-full h-auto justify-center items-center bg-white"
              >
                <div className="flex flex-col sm:flex-row w-full gap-5 sm:w-5/6 h-fit justify-between items-center p-5">
                  <input
                    type="checkbox"
                    value=""
                    className="w-10 h-10 rounded-md border-1 text-secondary border-black"
                  />
                  <img
                    src={item.menu.imageURL || "default_image_url_here"}
                    alt={item.menu.name}
                    className="w-32 h-32"
                  />
                  <h1 className="text-3xl sm:text-4xl font-semibold">
                    {item.menu.name}
                  </h1>
                  <div className="flex flex-col w-48 sm:w-60 h-fit justify-center items-center gap-3">
                    <h1 className="text-3xl font-medium text-black">
                      {item.menu.price} IDR
                    </h1>
                    <div className="flex flex-row w-3/4 h-fit items-center justify-between p-2 rounded-full border-4 border-black">
                      <button
                        type="button"
                        onClick={() => decrement(index)} // Decrement sesuai index
                        className="flex w-8 h-8 rounded-full justify-center items-center bg-secondary"
                      >
                        <Minus className="w-4 h-8" />
                      </button>
                      <h4 className="text-2xl font-medium text-black">
                        {item.quantity}
                      </h4>
                      <button
                        type="button"
                        onClick={() => increment(index)} // Increment sesuai index
                        className="flex w-8 h-8 rounded-full justify-center items-center bg-secondary"
                      >
                        <Plus className="w-8 h-8" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            ))
          ) : (
            <h1 className="text-2xl font-semibold">Your cart is empty</h1>
          )}
        </div>

        <div className="flex h-16 w-full sm:w-5/6 justify-between items-center px-5 mb-5 rounded-b-lg bg-tertiary">
          <div className="flex flex-col justify-start items-center">
            <h2 className="text-sm mr-9 text-white">
              Total items:{" "}
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </h2>
            <h1 className="text-2xl text-white">
              Total Price:{" "}
              {cartItems.reduce(
                (total, item) => total + item.quantity * item.menu.price,
                0
              )}{" "}
              IDR
            </h1>
          </div>
          <div className="flex">
            <div className="flex w-32 sm:w-40 h-8 justify-center items-center rounded-md p-2 bg-secondary">
              <button
                type="submit"
                onClick={handleFinishCart}
                href="/payment"
                className="text-lg font-bold text-white"
              >
                Pay Now!
              </button>
            </div>
          </div>
        </div>
      </main>

      <NewFooter />
    </div>
  );
};

export default Cart;
