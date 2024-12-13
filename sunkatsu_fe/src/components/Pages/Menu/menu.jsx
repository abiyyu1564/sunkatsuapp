import React, { useState } from "react";

import Navbar from "../../Fragment/Navbar";
import NewFooter from "../../Fragment/newFooter";
import NewMenuCard from "../../Fragment/newMenuCard";           
import FilterCategory from "../../Fragment/filterCategory";
import Carousel from "../../Fragment/carouselMenu";

const Menu = () => {
    const menuItems = ["All", "Food", "Drink", "Dessert"];
    const [selectedCategory, setSelectedCategory] = useState("All");
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <>
        <Navbar/>
        <div className="flex flex-col w-full justify-center items-center mt-16 bg-primary">
            <div className="flex flex-col justify-center items-center mt-10 gap-10">
                    <Carousel/>
                    <FilterCategory
                        menuItems={menuItems}
                        onCategoryChange={handleCategoryChange}
                    />
                    <NewMenuCard
                        category={selectedCategory}
                    />
            </div>
            <NewFooter/>
        </div>
        </>
    )
}

export default Menu;