import React, { useState } from "react";

import Navbar from "../../Fragment/Navbar";
import NewFooter from "../../Fragment/newFooter";
import NewMenuCard from "../../Fragment/newMenuCard";
import FilterCategory from "../../Fragment/filterCategory";
import Carousel from "../../Fragment/carouselMenu";
import FavoriteMenu from "../../Fragment/favoriteMenu";

const Menu = () => {
  const menuItems = ["All", "Food", "Drink", "Dessert"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col w-full justify-center items-center mt-16 bg-primary">
        <div className="flex flex-col justify-center items-center mt-10 gap-5">
          <Carousel />
          <h1 className="text-3xl font-bold text-tertiary">YOUR LATEST PURCHASE</h1>
          <FavoriteMenu />
          <FilterCategory
            menuItems={menuItems}
            onFilterChange={handleCategoryChange}
          />
          <NewMenuCard selectedCategory={selectedCategory} />
        </div>
        <NewFooter />
      </div>
    </>
  );
};

export default Menu;
