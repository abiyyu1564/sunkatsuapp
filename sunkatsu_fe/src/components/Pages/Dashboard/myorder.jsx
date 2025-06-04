import React, { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

import Navbar from "../../Fragment/Navbar";

const Order = () => {
  const [orders, setOrders] = useState([])
  const [customerNames, setCustomerNames] = useState({})
  const [imageURLs, setImageURLs] = useState({})
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(5)
  const [currentTime, setCurrentTime] = useState(new Date())


  // Status categories for filtering
  const categories = ["All", "Not Paid", "Accepted", "Finished"]

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

        const sortedOrders = response.data.sort((a, b) => {
          const dateA = new Date(a.finishedAt || a.createdAt)
          const dateB = new Date(b.finishedAt || b.createdAt)
          return dateB - dateA
        })

        setOrders(sortedOrders); // Menyimpan data order ke state
        if (
            user.role !== "CUSTOMER") {
          const customerData = {};
          for (const orders of sortedOrders) {
            if (!customerData[orders.userID]) {
              const customerResponse = await axios.get(
                  `http://localhost:8080/api/customers/${orders.userID}`,
                  {
                    headers: {
                      Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                  })
              customerData[orders.userID] = customerResponse.data.username;
            }
          }
          setCustomerNames(customerData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false)
      }
    }
    fetchOrders();

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)

  }, [user.role, user.id]);

  console.log(customerNames);
  const getCustomerbyId = async (id) => {
    try {
      const response = await axios.get(
          `http://localhost:8080/api/customers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching customer:", error);
      return null;
    }
  };

  const getImage = (menuId) => {
    // Jika URL gambar sudah ada di state imageURLs, langsung gunakan
    if (imageURLs[menuId]) {
      return imageURLs[menuId];
    }

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


  const buttonChange = (status, id) => {
    if (status === "Accepted") {
      return (
          <button
              onClick={() => handleFinishCart(id)}
              className="flex items-center justify-center w-20 h-fit focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Finish
          </button>
      );
    } else if (status === "Not Paid") {
      return (
          <button
              onClick={() => handleAcceptCart(id)}
              className="flex items-center justify-center w-20 h-fit focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Accept
          </button>
      );
    }
  };
  const handleSelect = (orderId, action) => {
    console.log(`Order ID: ${orderId}, Action: ${action}`);
  };

  const filteredOrders =
      selectedCategory === "All" ? orders : orders.filter((order) => order.status === selectedCategory)

  const handleFilterChange = (category) => {
    setSelectedCategory(category)
  }

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 5)
  }

  const handleShowLess = () => {
    setVisibleCount(5)
  }

  const formatCountdown = (dateString) => {
    const deadline = new Date(dateString)
    const now = currentTime

    const diffMs = deadline - now

    if (diffMs <= 0) {
      return "Pembayaran Expired"
    }
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000)

    if (diffHours > 0) {
      return `${diffHours} jam ${diffMinutes} menit lagi`
    } else if (diffMinutes > 0) {
      return `${diffMinutes} menit ${diffSeconds} detik lagi`
    } else {
      return `${diffSeconds} detik lagi`
    }
  }

  const renderPaymentDeadline = (order) => {
    if (order.status === "Not Paid") {
      const countdown = formatCountdown(order.paymentDeadline)
      const isExpired = countdown === "Pembayaran Expired"

      return (
          <div className={`${isExpired ? 'bg-red-100' : 'bg-yellow-50'} border rounded-lg p-3 mt-2`}>
            <div className="flex items-center gap-2">
              <svg className={`w-5 h-5 ${isExpired ? 'text-red-500' : 'text-yellow-600'}`}
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <div className={`font-medium ${isExpired ? 'text-red-700' : 'text-yellow-800'}`}>
                  {isExpired ? 'Pembayaran Expired' : 'Batas Waktu Pembayaran'}
                </div>
                <div className={`text-sm ${isExpired ? 'text-red-600' : 'text-yellow-700'}`}>
                  {isExpired ? formatDate(order.paymentDeadline) : countdown}
                </div>
              </div>
            </div>
          </div>
      )
    }
    return null
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatPrice = (price) => {
    return `Rp ${price.toLocaleString("id-ID")}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Not Paid":
        return "text-red-500"
      case "Accepted":
        return "text-green-500"
      case "Finished":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  // Group orders by date
  const groupOrdersByDate = (orders) => {
    const grouped = {}

    orders.forEach((order) => {
      const dateKey = formatDate(order.finishedAt)
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(order)
    })

    return grouped
  }

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

    // const groupedOrders = groupOrdersByDate(filteredOrders)
    const visibleOrders = filteredOrders.slice(0, visibleCount)
    const groupedOrders = groupOrdersByDate(visibleOrders)
    const hasMoreOrders = filteredOrders.length > visibleCount

    return (
        <div className="flex flex-col items-start w-full min-h-screen">
          <Navbar/>
          {/* Header */}
          <div className="flex flex-col w-full min-h-screen items-center gap-10 mt-16 px-[160px]">
              <div className="flex flex-col justify-start w-full h-12 gap-5">
                <h1 className="text-2xl font-bold text-gray-800">MY ORDERS</h1>
                {/* Category Filter */}
                <div className="flex w-full h-fit">
                  {categories.map((category) => (
                      <button
                          key={category}
                          onClick={() => handleFilterChange(category)}
                          className={`pb-2 px-1 font-medium transition-colors ${
                              selectedCategory === category
                                  ? "text-red-500 border-b-2 border-red-500"
                                  : "text-gray-600 hover:text-gray-800"
                          }`}
                      >
                        {category}
                      </button>
                  ))}
                </div>
              </div>

          {/* Orders List */}
          <div className="flex flex-col w-full h-fit mt-3 ">
            {Object.entries(groupedOrders).map(([date, dateOrders]) => (
                <div key={date} className="space-y-4">
                  {dateOrders.map((order) => (
                      <div key={order.id} className="space-y-4 border-y-2 py-4">
                        {/* Order Header */}
                        <div className="flex flex-col gap-2">
                          {user.role === "CUSTOMER" && (
                              <div>{renderPaymentDeadline(order)}</div>
                          )}
                          {user.role !== "CUSTOMER" && (
                              <div>{buttonChange(order.status, order.id)}</div>)}
                          {order.status !== "Not Paid" && (
                              <h2 className="text-lg font-semibold text-gray-700">{date}</h2>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                            {user.role !== "CUSTOMER" && (
                              <span className="font-semibold text-gray-800">{formatPrice(order.total)}</span>
                            )}
                            {user.role !== "CUSTOMER" && (
                            <span className="font-semibold text-gray-800">{customerNames[order.userID]}</span>
                            )}
                            <span className="text-gray-600">
                              {order.cartItems.length} Item{order.cartItems.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="flex flex-wrap w-full gap-2 justify-start pl-3">
                          {order.cartItems.map((item) => (
                              <div key={item.id} className="w-72 h-32 flex items-center justify-center bg-white border border-gray-200 rounded-lg p-4 shadow-md">
                                <div className="flex gap-3">
                                  <img
                                      src={getImage(item.menu.image) || "/placeholder.svg"}
                                      alt={item.menu.name}
                                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-800 truncate">{item.menu.name}</h3>
                                    <p className="text-sm text-gray-600 mb-1">{item.quantity}x</p>
                                    {item.note && <p className="text-xs text-gray-500 italic mb-2">"{item.note}"</p>}
                                    <p className="text-sm font-semibold text-gray-800">{formatPrice(item.menu.price)}</p>
                                  </div>
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                  ))}
                </div>
            ))}
          </div>

          {filteredOrders.length > 5 && (
              <div className="flex gap-4 mt-6 mb-8">
                {hasMoreOrders && (
                    <button
                        onClick={handleSeeMore}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
                    >
                      See More ({filteredOrders.length - visibleCount} more orders)
                    </button>
                )}
                {visibleCount > 5 && (
                    <button
                        onClick={handleShowLess}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      Show Less
                    </button>
                )}
              </div>
          )}

          {/* Empty State */}
          {filteredOrders.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">No orders found</p>
              </div>
          )}
          </div>
        </div>
    )
}
export default Order
