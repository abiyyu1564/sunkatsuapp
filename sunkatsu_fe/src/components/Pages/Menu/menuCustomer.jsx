// import React, { useState } from "react";

// import Navbar from "../../Fragment/Navbar";
// import FilterCategory from "../../Fragment/filterCategory";
// import NewMenuCard from "../../Fragment/newMenuCard";
// import NewLandingFooter from "../../Fragment/newFooter";

// import { GlobalProvider } from "../../../context/GlobalContext";

// const MenuCustomer = () => {
//   const menuItems = ["All", "Food", "Drink", "Dessert"];
//   const menu = ["Food", "Drink", "Dessert"];
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   const handleFilterChange = (category) => {
//     setSelectedCategory(category);
//     console.log("Selected category:", category);
//   };
//   return (
//     <div>
//       <div className="sticky top-0 z-10 bg-white shadow">
//         <Navbar />
//         <div className="sticky top-0 z-10 bg-white shadow">
//           <FilterCategory
//             menuItems={menuItems}
//             onFilterChange={handleFilterChange}
//             />
//         </div>
//         <NewMenuCard selectedCategory={selectedCategory} />
//         <NewLandingFooter />
//       </div>
//     </div>
//   );
// };

// export default MenuCustomer;

import { useState } from "react"
import Navbar from "../../Fragment/Navbar"
import FilterCategory from "../../Fragment/filterCategory"
import NewMenuCard from "../../Fragment/newMenuCard"
import NewLandingFooter from "../../Fragment/newFooter"

const MenuCustomer = () => {
  const menuItems = ["All", "Food", "Drink", "Dessert"]
  const menu = ["Food", "Drink", "Dessert"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const handleFilterChange = (category) => {
    setSelectedCategory(category)
    console.log("Selected category:", category)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Navbar />
        <div className="bg-gray-50 border-b border-gray-200 shadow-sm">
          <FilterCategory menuItems={menuItems} onFilterChange={handleFilterChange} />
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <NewMenuCard selectedCategory={selectedCategory} />
      </div>
      <NewLandingFooter />
    </div>
  )
}

export default MenuCustomer
