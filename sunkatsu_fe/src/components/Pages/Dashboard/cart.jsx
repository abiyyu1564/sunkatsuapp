"use client";

import { useEffect, useState, useContext } from "react";
import Navbar from "../../Fragment/Navbar";
import NewFooter from "../../Fragment/newFooter";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../context/GlobalContext";
import { jwtDecode } from "jwt-decode";
import { ReactComponent as Plus } from "../../Icon/Plus.svg";
import { ReactComponent as Minus } from "../../Icon/Minus.svg";
import { TiDeleteOutline } from "react-icons/ti";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { TiEdit, TiPlus } from "react-icons/ti";
import PopupEditCartItems from "../../Fragment/popupEditCartItems";
import Swal from "sweetalert2";

const Cart = () => {
  const { menu, getUser } = useContext(GlobalContext);
  const [cart, setCart] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [imageURLs, setImageURLs] = useState({});
  const [customerInfo, setCustomerInfo] = useState({});
  const [popupState, setPopupState] = useState({
    showAdd: false,
    showDetail: false,
    selectedMenu: null,
  });
  const id = jwtDecode(Cookies.get("token")).id;
  const token = Cookies.get("token");
  const navigate = useNavigate();

  const user = getUser();
  console.log(user);

  const handlePopup = (type, menu = null) => {
    setPopupState((prev) => ({
      ...prev,
      [type]: !prev[type],
      selectedMenu: menu,
    }));
  };

  // Existing getImage function
  const getImage = (menuId) => {
    if (imageURLs[menuId]) {
      return imageURLs[menuId];
    }

    axios
      .get(`http://localhost:8080/api/menus/images/${menuId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const imageURL = URL.createObjectURL(response.data);
        setImageURLs((prev) => ({
          ...prev,
          [menuId]: imageURL,
        }));
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });

    return "default_image_url_here";
  };

  // Fetch cart items and customer info
  useEffect(() => {
    // Fetch cart data
    axios
      .get(`http://localhost:8080/api/customers/${id}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCartItems(res.data.cartItems);
        setCart(res.data);
      })
      .catch((err) => console.error("Error fetching cart data:", err));

    // Fetch customer info
    axios
      .get(`http://localhost:8080/api/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCustomerInfo(res.data);
      })
      .catch((err) => console.error("Error fetching customer data:", err));
  }, [id]);

  // Existing functions (increment, decrement, handleFinishCart, deleteItemFromCart)
  const increment = (index) => {
    const itemToUpdate = cartItems[index];
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
        setCartItems((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      })
      .catch((err) => console.error("Error updating quantity:", err));
  };

  const decrement = (index) => {
    if (cartItems[index].quantity === 1) {
      deleteItemFromCart(cartItems[index].id);
    } else {
      const itemToUpdate = cartItems[index];
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
          setCartItems((prev) =>
            prev.map((item, i) =>
              i === index ? { ...item, quantity: item.quantity - 1 } : item
            )
          );
        })
        .catch((err) => console.error("Error updating quantity:", err));
    }
  };

  const successPopup = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "added to cart",
    });
    setTimeout(() => window.location.reload(), 2000); // Tutup popup setelah 1 detik
  };

  const addMenuToCart = async (menuItem) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/carts/${cart.id}/add-menu`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          params: {
            menuId: menuItem.id,
            quantity: 1,
            deliver: "in store",
            note: "",
          },
        }
      );
      successPopup();
    } catch (error) {
      console.error("Error adding menu to cart:", error);
      alert("Error adding menu to cart. Please try again.");
    }
  };

  const handleFinishCart = () => {
    Swal.fire({
      title: "Confirm Order?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            `http://localhost:8080/api/carts/${cart.id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          )
          .then((res) => {
            Swal.fire({
              title: "Finished!",
              timer: 1500,
              text: "Order has been Confirmed.",
              icon: "success",
            }).then(() => {
              window.location.reload();
            });
          })
          .catch((err) => console.error("Error finishing order:", err));
      }
    });
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
          })
          .catch((err) => console.error("Error deleting item from cart:", err));
      }
    });
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.menu.price,
    0
  );

  return (
    <div className="flex flex-col gap- bg-primary">
      <Navbar />
      {/* Header */}
      <div className="flex bg-primary shadow-sm border-b pt-20">
        <div className="max-w-4xl mx-16 px-1 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">Checkout</h1>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full mx-auto px-1 py-4 max-w-6xl">
        {/* Left Section */}
        <div className="w-1/4 space-y-6">
          <h3 className="text-lg font-semibold mb-4">Order Information</h3>

          <div>
            <h4 className="font-semibold text-gray-600 mb-1 text-sm uppercase">
              Customer
            </h4>
            <div className="border border-gray-300 rounded-md px-3 py-2 font-semibold bg-gray-50">
              {user.sub}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600 mb-1 text-sm uppercase">
              Outlet
            </h4>
            <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <p className="font-semibold">Sunkatsu Asrama Putra</p>
              <p className="text-xs text-gray-500">Telkom University</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600 mb-1 text-sm uppercase">
              Order Type
            </h4>
            <div className="border border-gray-300 rounded-md px-3 py-2 font-semibold bg-gray-50">
              Dine In
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex flex-col items-end space-y-6">
          {/* Payment Method */}
          <div className="w-3/4 border border-gray-300 rounded-md p-4 bg-white shadow-sm">
            <h3 className="text-lg font-bold mb-3">Payment Method</h3>
            <button className="bg-red-700 hover:bg-red-800 transition text-white font-semibold rounded-md px-4 py-2 w-full flex items-center justify-center gap-2">
              Pay at Sunkatsu Cashier <ArrowRight size={18} />
            </button>
          </div>

          {/* Payment Summary */}
          <div className="w-3/4 border border-gray-300 rounded-md p-4 bg-white shadow-sm">
            <h3 className="text-lg font-bold mb-3">Payment Summary</h3>
            <div className="text-sm text-gray-500 mb-4">
              <p>
                Total Item: Total items:{" "}
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
              <p>
                Total Price:{" "}
                {cartItems.reduce(
                  (total, item) => total + item.quantity * item.menu.price,
                  0
                )}{" "}
                IDR
              </p>
            </div>
            <button
              type="submit"
              onClick={handleFinishCart}
              href="/"
              className="bg-red-700 hover:bg-red-800 transition text-white font-semibold rounded-md px-4 py-2 w-full"
            >
              Check Out
            </button>
          </div>
        </div>
      </div>
      <section className="flex flex-col bg-primary rounded-lg p-6 mx-auto px-1 py-4 min-h-72 max-w-6xl w-full">
        <h2 className="font-bold text-2xl mb-4  pb-2">Order Summary</h2>

        {cartItems.length === 0 && (
          <p className="text-center text-gray-500">Your cart is empty</p>
        )}

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-y my-2 border-gray-300 py-4"
          >
            {/* Bagian gambar dan tombol edit dalam satu kolom */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex mb-2">
                <img
                  src={getImage(item.menu.image)}
                  alt={item.menu.name}
                  className="w-24 h-24 rounded-full object-cover border border-gray-300"
                />
                <div className="flex-1 ml-6">
                  <h3 className="font-semibold text-lg">{item.menu.name}</h3>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Notes:</span> {item.note}
                  </p>
                  <p className="font-bold mt-1">
                    Rp{" "}
                    {(item.menu.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  handlePopup("showDetail", item);
                }}
                className="bg-red-700 text-white px-3 mx-3 py-1 rounded-md flex self-start items-center gap-1 hover:bg-red-800 transition text-sm"
              >
                <TiEdit size={16} /> Edit
              </button>
              {popupState.showDetail && (
                <PopupEditCartItems
                  cartItem={popupState.selectedMenu}
                  show={popupState.showDetail}
                  onClose={() => handlePopup("showDetail")}
                />
              )}
            </div>

            {/* Bagian detail nama, notes, harga */}

            {/* Kontrol quantity di kanan */}
            <div className="flex items-center shadow-md rounded-full px-1 gap-4">
              <button
                onClick={() => decrement(cartItems.indexOf(item))}
                className="w-4 h-4 rounded-full bg-red-700 text-white flex justify-center items-center shadow hover:bg-red-800 transition"
              >
                <Minus className="w-2 h-2" />
              </button>
              <span className="text-md font-semibold">{item.quantity}</span>
              <button
                onClick={() => increment(cartItems.indexOf(item))}
                className="w-4 h-4 rounded-full bg-red-700 text-white flex justify-center items-center shadow hover:bg-red-800 transition"
              >
                <Plus className="w-2 h-2" />
              </button>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-flow-row overflow-x-auto max-w-6xl mx-auto w-full scrollbar-hide p-6">
        <div className="flex flex-nowrap gap-4 px-4">
          {menu.slice(0, 6).map((menuItem) => (
            <div className="flex-shrink-0 border border-gray-300 rounded-lg">
              <div
                key={menuItem.id}
                className="flex rounded-lg p-4 bg-white shadow-md justify-between w-96 h-40"
                style={{ borderRadius: "12px" }}
              >
                <div className="w-1/2 flex justify-center items-center">
                  <img
                    src={getImage(menuItem.image)}
                    className="w-28 h-28 rounded-md object-cover border border-gray-300"
                    alt="menu image"
                  />
                </div>
                <div className="w-1/2 flex flex-col justify-between pl-4">
                  <div>
                    <h1 className="font-bold text-lg">{menuItem.name}</h1>
                    <p className="text-base mt-1">
                      Rp {menuItem.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      addMenuToCart(menuItem);
                    }}
                    className="bg-red-600 text-white rounded-md px-4 py-2 flex items-center justify-center gap-2 hover:bg-red-700 transition text-sm"
                  >
                    Add to cart <TiPlus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NewFooter />
    </div>
  );
};

export default Cart;
