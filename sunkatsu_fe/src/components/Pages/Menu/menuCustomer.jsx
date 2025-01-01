import React, { useState } from "react";

import Navbar from "../../Fragment/Navbar";
import FilterCategory from "../../Fragment/filterCategory";
import NewMenuCard from "../../Fragment/newMenuCard";
import NewLandingFooter from "../../Fragment/newFooter";

import { GlobalProvider } from "../../../context/GlobalContext";

const MenuCustomer = () => {
  const menuItems = ["All", "Food", "Drink", "Dessert"];
  const menu = ["Food", "Drink", "Dessert"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };
  return (
    <div>
      <div>
        <Navbar />
        <FilterCategory
          menuItems={menuItems}
          onFilterChange={handleFilterChange}
        />
        <NewMenuCard selectedCategory={selectedCategory} />
        <NewLandingFooter />
      </div>
    </div>
  );
};

export default MenuCustomer;
