import React, { useEffect, useState } from "react";
import Navbar from "../../Fragment/Navbar";
import NewFooter from "../../Fragment/newFooter";
import FilterCategory from "../../Fragment/filterCategory";
import Dropdown from "../../Fragment/dropdownButton";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Order = () => {
  const [orders, setOrders] = useState([]); // State untuk menyimpan data API
  const [selectedCategory, setSelectedCategory] = useState("All Order");

  const menuItems = ["All Order", "Not Paid", "In Progress", "Finished"];
  const dropdownItems = [
    { label: "Accept Order", value: "acceptorder" },
    { label: "In Progress", value: "inprogress" },
    { label: "Done", value: "done" },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/orders", {
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
  }, []);

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
                      src={`http://localhost:8080${item.menu.imageURL}`}
                      alt={item.menu.name}
                      className="w-16 h-16 rounded-lg object-cover"
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
                  Total: {order.total} IDR
                </p>
                <p className="text-lg text-gray-600">
                  Status: <span className="font-medium">{order.status}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Payment Deadline:{" "}
                  {new Date(order.paymentDeadline).toLocaleString()}
                </p>
              </div>

              {/* Bagian aksi dropdown */}
              <div className="flex flex-col sm:w-1/3 w-full justify-center items-center gap-2">
                <Dropdown
                  buttonLabel="Select Action"
                  items={dropdownItems}
                  onSelect={(action) => handleSelect(order.id, action)}
                />
              </div>
            </section>
          ))
        ) : (
          <p className="text-2xl font-semibold text-white mt-10">
            No orders found.
          </p>
        )}
      </main>
      <NewFooter />
    </div>
  );
};

export default Order;
