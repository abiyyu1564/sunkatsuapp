"use client"

import { useContext, useState, useEffect } from "react"
import { GlobalContext } from "../../context/GlobalContext"
import AddMenu from "./popupAddMenu"
import DetailMenu from "./detailMenu"
import axios from "axios"
import Cookies from "js-cookie"
import Plus from "../../assets/menu_plus.png";


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
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-6">
        <div className="w-40 h-40 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={imageURLs[menuItem.image] || "/placeholder.svg?height=160&width=160"}
            alt={menuItem.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">{menuItem.name}</h3>
          <p className="text-xl font-medium text-gray-700 mb-3">Rp. {menuItem.price.toLocaleString("id-ID")}</p>
          <p className="text-gray-600 text-sm mb-6">{menuItem.desc}</p>

          {cartItems[menuItem.id] ? (
            <div className="flex items-center gap-4">
              <button
                className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-800 text-lg"
                onClick={() => handleQuantityChange(menuItem.id, -1)}
              >
                -
              </button>
              <span className="text-xl font-medium">{cartItems[menuItem.id]}</span>
              <button
                className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-800 text-lg"
                onClick={() => handleQuantityChange(menuItem.id, 1)}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="w-full bg-red-500 text-white py-1 px-8 rounded-lg font-medium hover:bg-red-800 transition-colors flex items-center justify-center gap-2 text-s-lg"
              onClick={() => handlePopup("showDetail", menuItem)}
            >
              Add to cart
              <img src={Plus} alt="+" className="w-5 h-5" />
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
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Food</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">{foodItems.map(renderMenuCard)}</div>
        </div>

        {/* Drink Section */}
        <div id="drink" className="mb-12 scroll-mt-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Drink</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">{drinkItems.map(renderMenuCard)}</div>
        </div>

        {/* Dessert Section */}
        <div id="dessert" className="mb-12 scroll-mt-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Dessert</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">{dessertItems.map(renderMenuCard)}</div>
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
    </div>
  )
}

export default NewMenuCard
