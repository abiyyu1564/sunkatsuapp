import React, { useEffect, useState } from "react";
import Navbar from "../../Fragment/Navbar";
import NewFooter from "../../Fragment/newFooter";
import FilterCategory from "../../Fragment/filterCategory";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const Order = () => {
  const [orders, setOrders] = useState([]); // State untuk menyimpan data API
  const [selectedCategory, setSelectedCategory] = useState("All Order");
  const [imageURLs, setImageURLs] = useState({});

  const menuItems = ["All Order", "Not Paid", "Accepted", "Finished"];

  const user = jwtDecode(Cookies.get("token"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url =
          user.role === "CUSTOMER"
            ? `http://localhost:8080/api/customers/${user.id}/orders`
            : "http://localhost:8080/api/orders";
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        setOrders(response.data); // Menyimpan data order ke state
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [user.role, user.id]);

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
          Authorization: `Bearer ${Cookies.get("token")}`,
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

  const handleSelect = (orderId, action) => {
    console.log(`Order ID: ${orderId}, Action: ${action}`);
  };

  const filteredMenu =
    selectedCategory === "All Order"
      ? orders
      : orders.filter((item) => item.status === selectedCategory);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  const handleFinishCart = (id) => {
    Swal.fire({
      title: "Finish order?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Finish it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `http://localhost:8080/api/orders/${id}/finish`,
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
              text: "Order has been Finished.",
              icon: "success",
            }).then(() => {
              window.location.reload();
            });
          })
          .catch((err) => console.error("Error finishing order:", err));
      }
    });
  };

  const handleAcceptCart = async (id) => {
    Swal.fire({
      title: "Accept order?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `http://localhost:8080/api/orders/${id}/accept`,
            {},
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          )
          .then((res) => {
            Swal.fire({
              title: "Accepted!",
              timer: 1500,
              text: "Order has been accepted.",
              icon: "success",
            }).then(() => {
              window.location.reload();
            });
          })
          .catch((err) => console.error("Error finishing order:", err));
      }
    });
  };

  const buttonChange = (status, id) => {
    if (status === "Accepted") {
      return (
        <button
          onClick={() => handleFinishCart(id)}
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Finish
        </button>
      );
    } else if (status === "Not Paid") {
      return (
        <button
          onClick={() => handleAcceptCart(id)}
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Accept
        </button>
      );
    } else if (status === "Finished") {
      return (
        <div className="focus:outline-none text-white bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
          Done
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Navbar />
      <main className="flex flex-col flex-grow justify-start items-center pt-14">
        <FilterCategory
          menuItems={menuItems}
          onFilterChange={handleFilterChange}
        />

        {/* Menampilkan data order */}
        {filteredMenu.length > 0 ? (
          filteredMenu.map((order) => (
            <section
              key={order.id}
              className="flex flex-col sm:flex-row w-full sm:w-5/6 h-fit rounded-lg py-10 px-5 bg-white mb-5"
            >
              {/* Bagian cartItems */}
              <div className="flex flex-col sm:w-1/3 w-full justify-start px-5 gap-2 mb-5 sm:mb-0">
                {order.cartItems.map((item) => (
                  <article key={item.id} className="flex items-center gap-4">
                    <img
                      src={getImage(item.menu.image)}
                      alt={item.menu.name}
                      className="w-16 h-16 rounded-lg object-fit"
                    />
                    <div>
                      <p className="text-xl font-semibold">{item.menu.name}</p>
                      <p className="text-sm text-gray-500">
                        Note: {item.note || "No notes"}
                      </p>
                      <span className="text-sm text-red-500">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              {/* Bagian total dan payment status */}
              <div className="flex flex-col sm:w-1/3 w-full justify-center items-center mb-5 sm:mb-0">
                <p className="text-2xl font-semibold">
                  Total: {order.total.toLocaleString("id-ID")} IDR
                </p>
                <p className="text-sm text-gray-500">
                  Payment Deadline:{" "}
                  {new Date(order.paymentDeadline).toLocaleString()}
                </p>
              </div>

              {/* Bagian aksi dropdown */}
              <div className="flex flex-col sm:w-1/3 w-full justify-center items-center gap-2">
                {user.role === "CUSTOMER" ? (
                  <p className="text-2xl font-semibold">
                    Status: {order.status}
                  </p>
                ) : (
                  <div>{buttonChange(order.status, order.id)}</div>
                )}
              </div>
            </section>
          ))
        ) : (
          <p className="text-2xl font-semibold text-tertiary mt-10">
            No orders found.
          </p>
        )}
      </main>
      <NewFooter />
    </div>
  );
};

export default Order;
