import React from "react";

import Navbar from "../../Fragment/Navbar";
import NewFooter from "../../Fragment/newFooter";
import NewMenuCard from "../../Fragment/newMenuCard";           
import FilterCategory from "../../Fragment/filterCategory";

const Menu = () => {
    const menuItems = ["All", "Food", "Drink", "Dessert"];

    return (
        <>
        <Navbar/>
        <div className="flex flex-col w-screen justify-center items-center mt-16 bg-primary">
            <div className="flex flex-col justify-center items-center">
                    <FilterCategory menuItems={menuItems}/>
                    <NewMenuCard/>

            </div>
            <NewFooter/>
        </div>
        </>
    )
}

export default Menu;