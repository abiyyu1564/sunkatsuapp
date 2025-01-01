import React, { useEffect, useState } from "react";
import Navbar from "../../Fragment/Navbar";
import NewFooter from "../../Fragment/newFooter";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ReactComponent as Plus } from "../../Icon/Plus.svg";
import { ReactComponent as Minus } from "../../Icon/Minus.svg";
import { TiDeleteOutline } from "react-icons/ti";
import Swal from "sweetalert2";

const Cart = () => {
  const [cart, setCart] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [imageURLs, setImageURLs] = useState({}); // Store image URLs here
  const id = jwtDecode(Cookies.get("token")).id;
  const token = Cookies.get("token");
  let navigate = useNavigate();

  console.log(jwtDecode(Cookies.get("token")));

  // Fungsi untuk mendapatkan URL gambar dengan cara yang lebih mirip dengan newMenuCard
  const getImage = (menuId) => {
    // Jika URL gambar sudah ada di state imageURLs, langsung gunakan
    if (imageURLs[menuId]) {
      return imageURLs[menuId];
    }

    // Jika belum, buat request untuk mendapatkan gambar
    axios
      .get(`http://localhost:8080/api/menus/images/${menuId}`, {
        // Endpoint ini hanya contoh, sesuaikan dengan API yang benar
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const imageURL = URL.createObjectURL(response.data);
        setImageURLs((prev) => ({
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
    const itemToUpdate = cartItems[index];
    console.log(itemToUpdate);
    // Perbarui kuantitas di backend
    axios
      .post(
        "http://localhost:8080/api/carts/increment",
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          params: {
            id: cart.id,
            cartItemId: itemToUpdate.id,
          },
        }
      )
      .then(() => {
        // Perbarui state jika berhasil
        setCartItems((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      })
      .catch((err) => console.error("Error updating quantity:", err));
  };

  // Fungsi Decrement
  const decrement = (index) => {
    if (cartItems[index].quantity === 1) {
      deleteItemFromCart(cartItems[index].id);
    } else {
      const itemToUpdate = cartItems[index];
      console.log(itemToUpdate);
      // Perbarui kuantitas di backend
      axios
        .post(
          "http://localhost:8080/api/carts/decrement",
          {},
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            params: {
              id: cart.id,
              cartItemId: itemToUpdate.id,
            },
          }
        )
        .then(() => {
          // Perbarui state jika berhasil
          setCartItems((prev) =>
            prev.map((item, i) =>
              i === index ? { ...item, quantity: item.quantity - 1 } : item
            )
          );
        })
        .catch((err) => console.error("Error updating quantity:", err));
    }
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
      .then((res) => {
        console.log("Cart finished:", res.data);
        alert("Cart finished!");
        window.location.reload();
      })
      .catch((err) => console.error("Error finishing cart:", err));
  };

  const deleteItemFromCart = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `http://localhost:8080/api/carts/${cart.id}/cart-items/${id}`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          )
          .then((res) => {
            Swal.fire({
              title: "Deleted!",
              timer: 1500,
              text: "Your file has been deleted.",
              icon: "success",
            }).then(() => {
              setCartItems(cartItems.filter((item) => item.id !== id));
            });
            // Update state
          })
          .catch((err) => console.error("Error deleting item from cart:", err));
      }
    });
  };

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
                  <button onClick={() => deleteItemFromCart(item.id)}>
                    <TiDeleteOutline size={40} color="red" />
                  </button>
                  <img
                    src={getImage(item.menu.image)} // Menggunakan getImage untuk fetch gambar berdasarkan menu ID
                    alt={item.menu.name}
                    className="w-32 h-32"
                  />
                  <h1 className="text-3xl sm:text-4xl font-semibold flex-1 min-w-[200px] text-left">
                    {item.menu.name}
                  </h1>
                  <div className="flex flex-col w-48 sm:w-60 h-fit justify-center items-center gap-3">
                    <h1 className="text-3xl font-medium text-black">
                      {item.menu.price * item.quantity} IDR
                    </h1>
                    <div className="flex flex-row w-3/4 h-fit items-center justify-evenly p-2 rounded-full border-2 border-black">
                      <button
                        type="button"
                        onClick={() => decrement(index)} // Decrement sesuai index
                        className="flex w-8 h-8 rounded-full justify-center items-center bg-secondary"
                      >
                        <Minus className="w-6 h-8" />
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
                href="/"
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
