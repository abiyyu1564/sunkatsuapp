import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

import Navbar from "../../Fragment/Navbar";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [customerNames, setCustomerNames] = useState({})

  useEffect(() => {
    try {
      const token = Cookies.get("token")
      if (token) {
        const decodedUser = jwtDecode(token)
        setUser(decodedUser)
      }
    } catch (error) {
      console.error("Error decoding token:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogout = () => {
    // Menghapus token dari localStorage/sessionStorage
    Cookies.remove("token") // Ganti dengan nama yang sesuai untuk token Anda

    // Atau jika token disimpan di sessionStorage
    // sessionStorage.removeItem("authToken");

    // Setelah logout, arahkan ke halaman login
    navigate("/login") // Ganti dengan route login yang sesuai
  }

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

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow-md p-6 w-80">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }

  if (!user) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">No User Found</h2>
            <p className="text-gray-600">Please login to continue</p>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Navbar/>
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </span>
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* User Info */}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{user.username}</h1>

            {/* Role Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              {user.role}
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-6">
              {user.role !== 'CUSTOMER' && (
                  <div className="w-full text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{user.id || "N/A"}</div>
                  <div className="text-sm text-gray-600">User ID</div>
                  </div>)}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                  onClick={handleLogout}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Profile
