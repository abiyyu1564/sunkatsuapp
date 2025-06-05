"use client"

import { useState, useEffect, useContext } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import Swal from "sweetalert2"
import { GlobalContext } from "../../../context/GlobalContext"

import Navbar from "../../Fragment/Navbar"

const OwnerDashboard = (menuId) => {
    const { menu, getUser, search, setFetchStatus, fetchStatus } = useContext(GlobalContext)
    const [allMenu, setAllMenu] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingMenu, setEditingMenu] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [imageURLs, setImageURLs] = useState({})

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        desc: "",
        category: "",
        image: null,
    })
    const [selectedImage, setSelectedImage] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const categories = ["All", "food", "drink", "dessert"]
    const baseURL = "http://localhost:8080"

    const user = getUser()

    useEffect(() => {
        let filtered = menu

        if (search) {
            filtered = filtered.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
        }

        if (selectedCategory !== "All") {
            filtered = filtered.filter((item) => item.category === selectedCategory.toLowerCase())
        }

        setAllMenu(filtered)
        setLoading(false)
    }, [menu, search, selectedCategory])

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

    const fetchImagePreview = async (imagePath) => {
        try {
            const response = await axios.get(`${baseURL}/api/menus/images/${imagePath}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
                responseType: "blob",
            })
            const imageURL = URL.createObjectURL(response.data)
            setSelectedImage(imageURL)
        } catch (error) {
            console.error("Error fetching image preview:", error)
        }
    }

    const handleEdit = (menuItem) => {
        setEditingMenu(menuItem)
        setFormData({
            name: menuItem.name || "",
            price: menuItem.price ? menuItem.price.toString() : "",
            desc: menuItem.desc || "",
            category: menuItem.category || "",
            image: null,
        })

        // If editing, try to get the image preview
        if (menuItem.image) {
            fetchImagePreview(menuItem.image)
        }

        setShowModal(true)
    }

    const handleDelete = async (menuId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        })

        if (result.isConfirmed) {
            try {
                await axios.delete(`${baseURL}/api/menus/${menuId}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                })
                Swal.fire("Deleted!", "Menu has been deleted.", "success")
                setFetchStatus(!fetchStatus)
            } catch (error) {
                console.error("Error deleting menu:", error)
                Swal.fire("Error", "Failed to delete menu", "error")
            }
        }
    }

    const handleAddNew = () => {
        setEditingMenu(null)
        setFormData({
            name: "",
            price: "",
            desc: "",
            category: "",
            image: null,
        })
        setSelectedImage(null)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingMenu(null)
        setFormData({
            name: "",
            price: "",
            desc: "",
            category: "",
            image: null,
        })
        setSelectedImage(null)
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setSelectedImage(imageUrl)
            setFormData((prev) => ({
                ...prev,
                image: file,
            }))
        }
    }

    // PERBAIKAN UTAMA: Menggunakan pola yang sama dengan EditMenu.jsx yang berhasil
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        const { image, name, desc, price, category } = formData

        // Validasi input
        if (!name || !desc || !price || !category) {
            Swal.fire("Error", "Please fill in all fields.", "error")
            setIsSubmitting(false)
            return
        }

        if (!editingMenu && !image) {
            Swal.fire("Error", "Please select an image for new menu.", "error")
            setIsSubmitting(false)
            return
        }

        try {
            if (editingMenu) {
                // Update existing menu - menggunakan pola yang sama dengan EditMenu.jsx
                const formDataToSend = new FormData()

                // Jika ada gambar baru, tambahkan ke FormData
                if (image) {
                    formDataToSend.append("file", image)
                }

                // Kirim request update dengan struktur yang sama seperti EditMenu.jsx
                await axios.put(`${baseURL}/api/menus/${editingMenu.id}`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                    params: {
                        name,
                        price: Number.parseInt(price), // Pastikan price adalah number
                        desc,
                        category,
                        nums_bought: editingMenu.numsBought || 0, // Tambahkan nums_bought seperti di EditMenu.jsx
                    },
                })

                Swal.fire("Success", "Menu updated successfully", "success")
            } else {
                // Create new menu
                const formDataToSend = new FormData()
                formDataToSend.append("file", image)

                await axios.post(`${baseURL}/api/menus`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                    params: {
                        name,
                        desc,
                        price: Number.parseInt(price),
                        category,
                        nums_bought: 0,
                    },
                })
                Swal.fire("Success", "Menu created successfully", "success")
            }

            closeModal()
            setFetchStatus(!fetchStatus)
        } catch (error) {
            console.error("Error saving menu:", error.response?.data || error.message)

            // Log detail error untuk debugging
            if (error.response) {
                console.error("Response status:", error.response.status)
                console.error("Response data:", error.response.data)
                console.error("Request config:", error.config)
            }

            Swal.fire("Error", `Failed to save menu: ${error.response?.data?.message || error.message}`, "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatPrice = (price) => {
        return `Rp. ${price.toLocaleString("id-ID")}`
    }

    if (user.role !== "OWNER") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600">Only owners can access this dashboard</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Header */}
            <div className="bg-white mt-16 shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Sunkatsu Menu Management</h1>
                            <p className="text-gray-600">Manage your restaurant menu items</p>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Menu
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Menu</p>
                                <p className="text-2xl font-semibold text-gray-900">{menu.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293a1 1 0 00.293 1.414L6.414 18H19a2 2 0 002-2V8a2 2 0 00-2-2H8.586l-.293-.293a1 1 0 00-1.414 0L5.586 7H3"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Food Items</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {menu.filter((item) => item.category === "food").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Drinks</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {menu.filter((item) => item.category === "drink").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zM3 9a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Desserts</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {menu.filter((item) => item.category === "dessert").length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 overflow-x-auto py-4">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`whitespace-nowrap px-3 py-2 rounded-md font-medium transition-colors ${
                                    selectedCategory === category
                                        ? "bg-red-100 text-red-700 border-b-2 border-red-500"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                {category === "All" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-12 animate-pulse">
                                <div className="flex gap-6">
                                    <div className="w-40 h-40 bg-gray-300 rounded-full flex-shrink-0"></div>
                                    <div className="flex-1">
                                        <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                                        <div className="h-5 bg-gray-300 rounded w-1/4 mb-3"></div>
                                        <div className="h-4 bg-gray-300 rounded w-full mb-6"></div>
                                        <div className="h-10 bg-gray-300 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {allMenu.length === 0 ? (
                            <div className="text-center py-12">
                                <svg
                                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No menus found</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                <button
                                    onClick={handleAddNew}
                                    className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Add Your First Menu
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {allMenu.map((menuItem) => (
                                    <MenuCard
                                        key={menuItem.id}
                                        menuItem={menuItem}
                                        imageURLs={imageURLs}
                                        formatPrice={formatPrice}
                                        handleEdit={handleEdit}
                                        handleDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Menu Form Modal */}
            <MenuFormModal
                showModal={showModal}
                editingMenu={editingMenu}
                formData={formData}
                selectedImage={selectedImage}
                categories={categories}
                isSubmitting={isSubmitting}
                closeModal={closeModal}
                handleSubmit={handleSubmit}
                handleFormChange={handleFormChange}
                handleImageChange={handleImageChange}
            />
        </div>
    )
}

// Menu Card Component
const MenuCard = ({ menuItem, imageURLs, formatPrice, handleEdit, handleDelete }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 hover:shadow-md transition-shadow">
        <div className="flex gap-6">
            {/* Menu Image */}
            <div className="w-40 h-40 rounded-full overflow-hidden flex-shrink-0">
                <img
                    src={imageURLs[menuItem.image] || "/placeholder.svg?height=160&width=160"}
                    alt={menuItem.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Menu Content */}
            <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">{menuItem.name}</h3>
                <p className="text-xl font-medium text-gray-700 mb-3">{formatPrice(menuItem.price)}</p>
                <p className="text-gray-600 text-sm mb-6">{menuItem.desc}</p>

                {/* Category Badge */}
                <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
            {menuItem.category.charAt(0).toUpperCase() + menuItem.category.slice(1)}
          </span>
                </div>

                {/* Admin Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => handleEdit(menuItem)}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(menuItem.id)}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
)

// Menu Form Modal Component
const MenuFormModal = ({
                           showModal,
                           editingMenu,
                           formData,
                           selectedImage,
                           categories,
                           isSubmitting,
                           closeModal,
                           handleSubmit,
                           handleFormChange,
                           handleImageChange,
                       }) => {
    if (!showModal) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">{editingMenu ? "Edit Menu" : "Add New Menu"}</h2>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex gap-8">
                        {/* Left Section - Image Upload */}
                        <div className="w-1/2 flex flex-col justify-center items-center">
                            {selectedImage ? (
                                <div className="flex flex-col items-center">
                                    <img
                                        src={selectedImage || "/placeholder.svg"}
                                        alt="Selected"
                                        className="w-48 h-48 object-cover rounded-md mb-4"
                                    />
                                    <label htmlFor="imageInput" className="text-red-500 font-bold cursor-pointer hover:underline">
                                        Change Image
                                    </label>
                                </div>
                            ) : (
                                <label
                                    htmlFor="imageInput"
                                    className="w-full h-64 flex flex-col justify-center items-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 transition-colors"
                                >
                                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <p className="text-gray-600 font-medium text-lg">Add Menu Picture</p>
                                </label>
                            )}
                            <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>

                        {/* Right Section - Form Fields */}
                        <div className="w-1/2 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Insert Menu Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    value={formData.price}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Insert Menu Price"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="">Select Category</option>
                                    {categories.slice(1).map((category) => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="desc"
                                    required
                                    value={formData.desc}
                                    onChange={handleFormChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Insert Menu Description"
                                />
                            </div>

                            {!editingMenu && <p className="text-sm text-gray-500">Image is required for new menu</p>}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "Submit"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default OwnerDashboard
