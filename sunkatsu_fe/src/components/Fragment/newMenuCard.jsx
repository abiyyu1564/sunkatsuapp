"use client"

import { useContext, useState, useEffect } from "react"
import { GlobalContext } from "../../context/GlobalContext"
import AddMenu from "./popupAddMenu"
import DetailMenu from "./detailMenu"
import axios from "axios"
import Cookies from "js-cookie"

const NewMenuCard = ({ selectedCategory }) => {
  const { menu, getUser, search } = useContext(GlobalContext)
  const [allMenu, setAllMenu] = useState([])
  const [popupState, setPopupState] = useState({
    showAdd: false,
    showDetail: false,
    selectedMenu: null,
  })
  const [imageURLs, setImageURLs] = useState({})
  const [cartItems, setCartItems] = useState({}) // Track items in cart with quantities

  const handlePopup = (type, menu = null) => {
    setPopupState((prev) => ({
      ...prev,
      [type]: !prev[type],
      selectedMenu: menu,
    }))
  }

  // Handle adding item to cart (called from DetailMenu)
  const handleAddToCart = (menuId, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      [menuId]: quantity,
    }))
  }

  // Handle quantity change from card buttons
  const handleQuantityChange = (menuId, change) => {
    setCartItems((prev) => {
      const currentQty = prev[menuId] || 0
      const newQty = Math.max(0, currentQty + change)
      if (newQty === 0) {
        const { [menuId]: removed, ...rest } = prev
        return rest
      }
      return { ...prev, [menuId]: newQty }
    })
  }

  const user = getUser()

  // Scroll to the selected category section
  useEffect(() => {
    if (selectedCategory === "All") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    const targetElement = document.getElementById(selectedCategory.toLowerCase())
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [selectedCategory])

  useEffect(() => {
    let filtered = menu

    if (search) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    setAllMenu(filtered)
  }, [menu, search])

  const baseURL = "http://localhost:8080"

  useEffect(() => {
    const fetchImages = async () => {
      const newImageURLs = {}
      for (const item of allMenu) {
        try {
          const response = await axios.get(`${baseURL}/api/menus/images/${item.image}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            responseType: "blob",
          })
          const imageURL = URL.createObjectURL(response.data)
          newImageURLs[item.image] = imageURL
        } catch (error) {
          console.error(`Error fetching image for ${item.name}:`, error)
        }
      }
      setImageURLs(newImageURLs)
    }

    if (allMenu.length > 0) {
      fetchImages()
    }
  }, [allMenu])

  const foodItems = allMenu.filter((item) => item.category === "food")
  const drinkItems = allMenu.filter((item) => item.category === "drink")
  const dessertItems = allMenu.filter((item) => item.category === "dessert")

  const renderMenuCard = (menuItem) => (
    <div
      key={menuItem.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={imageURLs[menuItem.image] || "/placeholder.svg?height=128&width=128"}
            alt={menuItem.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{menuItem.name}</h3>
          <p className="text-lg font-medium text-gray-700 mb-2">Rp. {menuItem.price.toLocaleString("id-ID")}</p>
          <p className="text-gray-600 text-sm mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

          {/* Conditional rendering of button or quantity controls */}
          {cartItems[menuItem.id] ? (
            <div className="flex items-center gap-3">
              <button
                className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                onClick={() => handleQuantityChange(menuItem.id, -1)}
              >
                -
              </button>
              <span className="text-lg font-medium">{cartItems[menuItem.id]}</span>
              <button
                className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                onClick={() => handleQuantityChange(menuItem.id, 1)}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              onClick={() => handlePopup("showDetail", menuItem)}
            >
              Add to cart
              <span className="text-lg">+</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 py-6 max-w-6xl mx-auto w-full">
        {/* Food Section */}
        <div id="food" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Food</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{foodItems.map(renderMenuCard)}</div>
        </div>

        {/* Drink Section */}
        <div id="drink" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Drink</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{drinkItems.map(renderMenuCard)}</div>
        </div>

        {/* Dessert Section */}
        <div id="dessert" className="mb-12 scroll-mt-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Dessert</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{dessertItems.map(renderMenuCard)}</div>
        </div>
      </div>

      {popupState.showDetail && (
        <DetailMenu
          menuId={popupState.selectedMenu}
          show={popupState.showDetail}
          onClose={() => handlePopup("showDetail")}
          onAddToCart={handleAddToCart}
        />
      )}

      {user.role === "OWNER" ? (
        <div className="fixed bottom-10 right-10">
          <button
            className="bg-tertiary hover:bg-red-600 text-white font-bold py-2 px-4 rounded-2xl"
            onClick={() => handlePopup("showAdd")}
          >
            Tambah data Menu
          </button>
          {popupState.showAdd && <AddMenu show={popupState.showAdd} onClose={() => handlePopup("showAdd")} />}
        </div>
      ) : (
        <span></span>
      )}
    </div>
  )
}

export default NewMenuCard
