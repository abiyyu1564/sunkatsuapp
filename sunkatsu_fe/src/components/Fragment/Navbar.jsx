import { useState, useContext } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { ReactComponent as ChatIcon } from "../Icon/chat1.svg";
import { ReactComponent as ProfileIcon } from "../Icon/profile1.svg";
import { ReactComponent as SearchIcon } from "../Icon/search1.svg";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { GlobalContext } from "../../context/GlobalContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { search, setSearch, getUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [input, setInput] = useState({ search: "" });

  const user = getUser();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(input.search);
    navigate("/menu");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <nav className="fixed top-0 w-full h-16 z-[99] bg-white border-b border-gray-200">
      <div className="max-w-full mx-5 px- sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="text-3xl font-bold text-gray-900 tracking-wide">
              SUNKATSU
            </div>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex items-center space-x-12">
            <a
              href="/"
              className="text-gray-700 hover:text-gray-900 font-bold text-lg uppercase tracking-wide"
            >
              HOME
            </a>
            <a
              href="/menu"
              className="text-gray-700 hover:text-gray-900 font-bold text-lg uppercase tracking-wide"
            >
              MENU
            </a>
            <a
              href="/cart"
              className="text-gray-700 hover:text-gray-900 font-bold text-lg uppercase tracking-wide"
            >
              CART
            </a>
            <a
              href="/order"
              className="text-gray-700 hover:text-gray-900 font-bold text-lg uppercase tracking-wide"
            >
              ORDER
            </a>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  onChange={handleInput}
                  value={input.search}
                  name="search"
                  className="w-48 h-9 pl-3 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Search..."
                />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 text-gray-500" />
              </div>
            </form>

            <Link to="/chat_page" className="p-2 hover:bg-gray-100 rounded-lg">
              <ChatIcon className="w-8 h-8 text-black" />
            </Link>
            <a
              href="/chatbot_page"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FaQuestionCircle className="w-8 h-8 text-black" />
            </a>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ProfileIcon className="w-8 h-8 text-gray-700" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-1">
                  {user ? (
                    <>
                      <a
                        href="/profile"
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </a>
                      {user.role === "OWNER" && (
                        <a
                          href="/dashboard"
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard
                        </a>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <a
                      href="/login"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="flex flex-row gap-4 md:hidden">
            <SearchIcon
              className="w-6 h-6 text-gray-700"
              onClick={toggleMenu}
            />
            <button
              className="text-gray-700 p-1 hover:bg-gray-100 rounded-lg"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <AiOutlineClose className="w-6 h-6" />
              ) : (
                <AiOutlineMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
              <a
                href="/"
                className="block py-2 text-gray-700 font-medium uppercase"
              >
                HOME
              </a>
              <a
                href="/menu"
                className="block py-2 text-gray-700 font-medium uppercase"
              >
                MENU
              </a>
              <a
                href="/cart"
                className="block py-2 text-gray-700 font-medium uppercase"
              >
                CART
              </a>
              <a
                href="/order"
                className="block py-2 text-gray-700 font-medium uppercase"
              >
                ORDER
              </a>
            </div>

            <div className="flex items-center justify-around pt-4 border-t border-gray-200">
              <Link
                to="/chat_page"
                className="flex flex-col items-center space-y-1"
              >
                <ChatIcon className="w-7 h-7 text-gray-700" />
                <span className="text-xs text-gray-600">Chat</span>
              </Link>

              <a
                href="/chatbot_page"
                className="flex flex-col items-center space-y-1"
              >
                <FaQuestionCircle className="w-7 h-7 text-gray-700" />
                <span className="text-xs text-gray-600">Assistant</span>
              </a>

              <a
                href={user ? "/profile" : "/login"}
                className="flex flex-col items-center space-y-1"
              >
                <ProfileIcon className="w-8 h-8 text-gray-700" />
                <span className="text-xs text-gray-600">
                  {user ? "Profile" : "Login"}
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
