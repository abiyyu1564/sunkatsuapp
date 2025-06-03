import { useState, useContext } from "react"
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"
import { ReactComponent as ChatIcon } from "../Icon/chat1.svg"
import { ReactComponent as ProfileIcon } from "../Icon/profile1.svg"
import { ReactComponent as SearchIcon } from "../Icon/search1.svg"
import { FaQuestionCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom" // Import useNavigate untuk routing
import Cookies from "js-cookie"
import { GlobalContext } from "../../context/GlobalContext"
import { Link } from "react-router-dom"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const { search, setSearch } = useContext(GlobalContext)
  const navigate = useNavigate() // Hook untuk navigasi ke halaman lain
  const [input, setInput] = useState({ search: "" })

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  // Fungsi untuk handle logout
  const handleLogout = () => {
    // Menghapus token dari localStorage/sessionStorage
    Cookies.remove("token") // Ganti dengan nama yang sesuai untuk token Anda

    // Atau jika token disimpan di sessionStorage
    // sessionStorage.removeItem("authToken");

    // Setelah logout, arahkan ke halaman login
    navigate("/login") // Ganti dengan route login yang sesuai
  }

  const handleSearch = (e) => {
    e.preventDefault() // Mencegah reload halaman saat submit form
    setSearch(input.search) // Set nilai pencarian ke context
    navigate("/menu") // Redirect ke halaman menu
  }

  const handleInput = (e) => {
    const { name, value } = e.target
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  return (
    <nav className="fixed top-0 w-full h-16 z-[99] bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div href="/" className="flex-shrink-0 ">
            <div className="text-3xl font-bold text-gray-900 tracking-wide">SUNKATSU</div>
          </div>

          {/* Menu Items (Desktop) - Centered */}
          <div className="hidden md:flex items-center space-x-12">
            <div className="flex space-x-12 items-center">
              <a
                className="text-gray-700 hover:text-gray-900 font-bold text-sm uppercase tracking-wide transition-colors"
                href="/"
              >
                HOME
              </a>
              <a
                className="text-gray-700 hover:text-gray-900 font-bold text-sm uppercase tracking-wide transition-colors"
                href="/menu"
              >
                MENU
              </a>
              <a
                className="text-gray-700 hover:text-gray-900 font-bold text-sm uppercase tracking-wide transition-colors"
                href="/cart"
              >
                CART
              </a>
              <a
                className="text-gray-700 hover:text-gray-900 font-bold text-sm uppercase tracking-wide transition-colors"
                href="/order"
              >
                ORDER
              </a>
            </div>
          </div>

          {/* Navbar Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    onChange={handleInput}
                    value={input.search}
                    name="search"
                    className="w-48 h-9 pl-3 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                    placeholder="Search..."
                  />
                  <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </form>
            </div>
            <Link to="/chat_page" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChatIcon className="w-7 h-7 text-gray-700" />
            </Link>
            <a href="/chatbot_page" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FaQuestionCircle className="w-5 h-5 text-gray-700" />
            </a>
            {/* <a href="/cart" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <CartIcon className="w-5 h-5 text-gray-700" />
            </a> */}

            {/* Profile Icon with Dropdown */}
            <div className="relative">
              <button onClick={toggleProfileDropdown} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ProfileIcon className="w-7 h-7 text-gray-700" />
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-1">
                  <a
                    href="/profile"
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hamburger Button (Mobile) */}
          <div className="flex flex-row gap-4 md:hidden">
            <SearchIcon className="w-6 h-6 text-gray-700" onClick={toggleMenu} />
            <button
              className="block md:hidden text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <AiOutlineClose className="w-6 h-6" /> : <AiOutlineMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu for Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center">
              <div className="relative w-full">
                <input
                  onChange={handleInput}
                  value={input.search}
                  name="search"
                  className="w-full h-9 pl-3 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Search..."
                />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <a className="block py-2 text-gray-700 font-medium uppercase tracking-wide" href="/">
                HOME
              </a>
              <a className="block py-2 text-gray-700 font-medium uppercase tracking-wide" href="/menu">
                MENU
              </a>
              <a className="block py-2 text-gray-700 font-medium uppercase tracking-wide" href="/cart">
                CART
              </a>
              <a className="block py-2 text-gray-700 font-medium uppercase tracking-wide" href="/order">
                ORDER
              </a>
            </div>

            <div className="flex items-center justify-around pt-4 border-t border-gray-200">
              <Link to="/chat_page" className="flex flex-col items-center space-y-1">
                <ChatIcon className="w-7 h-7 text-gray-700" />
                <span className="text-xs text-gray-600">Chat</span>
              </Link>

              <a href="/chatbot_page" className="flex flex-col items-center space-y-1">
                <FaQuestionCircle className="w-7 h-7 text-gray-700" />
                <span className="text-xs text-gray-600">Assistant</span>
              </a>

              {/* <a href="/cart" className="flex flex-col items-center space-y-1">
                <CartIcon className="w-5 h-5 text-gray-700" />
                <span className="text-xs text-gray-600">Cart</span>
              </a> */}

              <a href="/profile" className="flex flex-col items-center space-y-1">
                <ProfileIcon className="w-7 h-7 text-gray-700" />
                <span className="text-xs text-gray-600">Profile</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
