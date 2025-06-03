// DetailMenu.js
import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import EditMenu from "./popupEditMenu";
import { deleteMenu } from "../../services/crudMenu";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import Mines from "../../assets/menu_minus.png";
import Plus from "../../assets/menu_plus.png";

const DetailMenu = ({ show, onClose, menuId }) => {
  const { getUser } = useContext(GlobalContext);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isCart, setIsCart] = useState(null);
  const [menuImageURL, setMenuImageURL] = useState(null);

  const [input, setInput] = useState({
    menuId: menuId.id,
    quantity: 1, // Default quantity
    deliver: "in store",
    note: "",
  });

  const decode = jwtDecode(Cookies.get("token"));

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

  // Fungsi untuk membuat cart kosong jika tidak ada
  const getEmptyCart = async () => {
    const id = decode.id;
    if (!id) {
      console.error("User ID is missing!");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8080/api/carts/empty", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        params: {
          UserId: id,
        },
      });
      console.log("Empty cart created successfully:", res.data);
      setIsCart(res.data);
    } catch (err) {
      console.error("Error creating empty cart:", err);
    }
  };

  // useEffect untuk memeriksa cart dan mengambil data jika ada
  useEffect(() => {
    const fetchCartData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Token is missing!");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8080/api/customers/${decode.id}/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data && res.data.id) {
          console.log("Cart exists:", res.data);
          setIsCart(res.data);
        } else {
          console.log("Cart not found, creating an empty cart.");
          await getEmptyCart();
        }
      } catch (err) {
        console.error("Error fetching cart data:", err);
        await getEmptyCart();
      }
    };

    if (menuId && menuId.id) {
      fetchCartData();
    }
  }, [menuId]);

  // Fetch image for the menu item
  const fetchImage = async () => {
    const baseURL = "http://localhost:8080";
    try {
      const response = await axios.get(
        `${baseURL}/api/menus/images/${menuId.image}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          responseType: "blob",
        }
      );
      const imageURL = URL.createObjectURL(response.data);
      console.log(imageURL);
      setMenuImageURL(imageURL);
    } catch (error) {
      console.error("Error fetching image for menu:", error);
    }
  };

  // Fetch image when menuId changes
  useEffect(() => {
    if (menuId && menuId.image) {
      fetchImage();
    }
  }, [menuId]);

  const handleEditClick = () => {
    setShowEditPopup(true);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
  };

  const deleteHandler = (id) => {
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
        deleteMenu(id, () => {
          Swal.fire({
            title: "Deleted!",
            timer: 1500,
            text: "Your file has been deleted.",
            icon: "success",
          }).then(() => {
            window.location.reload();
          });
        });
      }
    });
  };

  const user = getUser();
  const baseURL = "http://localhost:8080";

  const handleInput = (event) => {
    const { name, value } = event.target;
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addMenuToCart = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/carts/${isCart.id}/add-menu`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          params: {
            menuId: menuId.id,
            quantity: input.quantity,
            deliver: input.deliver,
            note: input.note,
          },
        }
      );
      successPopup();
    } catch (error) {
      console.error("Error adding menu to cart:", error);
      alert("Error adding menu to cart. Please try again.");
    }
  };

  // Handle increment and decrement for quantity
  const incrementQuantity = () => {
    setInput((prevState) => ({
      ...prevState,
      quantity: prevState.quantity + 1,
    }));
  };

  const decrementQuantity = () => {
    setInput((prevState) => ({
      ...prevState,
      quantity: prevState.quantity > 1 ? prevState.quantity - 1 : 1, // Minimum quantity is 1
    }));
  };

  const buttonChange = () => {
    if (user.role === "OWNER") {
      return (
        <div className="flex justify-end gap-4 mt-4">
          <button
            className="bg-black h-10 w-40 mt-6 text-white font-bold py-2 px-6 rounded-md hover:opacity-90"
            onClick={() => deleteHandler(menuId.id)}
          >
            Delete Menu
          </button>
          <button
            className="bg-secondary hover:bg-red-700 transition w-40 mt-6 h-10 text-white font-bold text-sm rounded-md self-end"
            onClick={handleEditClick}
          >
            Edit Menu
          </button>
          <EditMenu
            show={showEditPopup}
            onClose={closeEditPopup}
            menuId={menuId}
          />
        </div>
      );
    } else if (user.role === "CUSTOMER") {
      return (
        <div className="flex justify-end gap-4 mt-4">
          <button
            className="bg-secondary h-10 w-40 mt-6 text-white font-bold py-2 px-6 rounded-md hover:opacity-90"
            onClick={addMenuToCart}
          >
            Add to Cart
          </button>
        </div>
      );
    } else {
      return <></>;
    }
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden">
        <div className="relative">
          {/* Close button */}
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10" onClick={onClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left side - Image and title */}
              <div className="md:w-1/2">
                <div className="flex flex-col items-center">
                  {menuImageURL && (
                    <img
                      src={menuImageURL || "/placeholder.svg"}
                      alt={menuId.name}
                      className="w-64 h-64 rounded-full object-cover"
                    />
                  )}
                  <h2 className="text-2xl font-bold mt-4 text-center">{menuId.name}</h2>
                  <p className="text-gray-600 mt-2 text-center">
                    {menuId.desc || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                  </p>
                  <p className="text-xl font-bold text-gray-800 mt-2">
                    Rp {menuId.price?.toLocaleString("id-ID") || "0"}
                  </p>
                </div>
              </div>

              {/* Right side - Customize order */}
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold mb-4">Customize your order</h3>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Notes</label>
                  <input
                    type="text"
                    name="note"
                    value={input.note}
                    onChange={handleInput}
                    placeholder="Ex. Half portion rice"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Price and quantity */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xl font-bold">Rp {menuId.price?.toLocaleString("id-ID") || "0"}</p>

                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                    <button
                      onClick={decrementQuantity}
                      className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-800"
                    >
                      <img src={Mines} alt="Minus" className="w-5 h-5" />
                    </button>
                    <span className="w-8 text-center font-medium">{input.quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-800"
                    >
                      <img src={Plus} alt="Plus" className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                {buttonChange()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="flex justify-center items-center h-screen fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
    //   <div className="relative flex border-secondary border-8 gap-5 w-7/12 rounded-2xl p-6 bg-white shadow-md">
    //     {/* Tombol Close di Pojok Kanan Atas */}
    //     <button
    //       className="absolute top-2 right-2 text-black rounded-full w-8 h-8 flex justify-center items-center"
    //       onClick={onClose}
    //     >
    //       &times;
    //     </button>

    //     {/* Left Section */}
    //     <div className="w-1/2 flex flex-col items-center">
    //       <h1 className="font-bold text-2xl mb-6 text-black">{menuId.name}</h1>
    //       {menuImageURL && (
    //         <img
    //           src={menuImageURL}
    //           alt={menuId.name}
    //           className="w-48 h-48 rounded-full"
    //         />
    //       )}
    //     </div>

    //     <div className="w-1/2 flex flex-col justify-evenly">
    //       <p className="text-sm text-gray-700 leading-relaxed">{menuId.desc}</p>
    //       <div>
    //         <h2 className="text-secondary mb-6 font-bold text-2xl">
    //           {menuId.price}
    //         </h2>
    //       </div>

    //       {/* Quantity Selector */}
    //       <div className="flex items-center gap-4">
    //         <button
    //           onClick={decrementQuantity}
    //           className="bg-gray-300 px-4 py-2 rounded-md font-bold"
    //         >
    //           -
    //         </button>
    //         <input
    //           type="number"
    //           name="quantity"
    //           value={input.quantity}
    //           onChange={handleInput}
    //           className="w-16 text-center border-2 border-gray-300 rounded-md"
    //           min="1"
    //         />
    //         <button
    //           onClick={incrementQuantity}
    //           className="bg-gray-300 px-4 py-2 rounded-md font-bold"
    //         >
    //           +
    //         </button>
    //       </div>

    //       <input
    //         type="text"
    //         placeholder="Note..."
    //         name="note"
    //         value={input.note}
    //         onChange={handleInput}
    //         className="border-2 border-gray-300 rounded-md p-2 mt-4"
    //       />

    //       <div>{buttonChange()}</div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default DetailMenu;
