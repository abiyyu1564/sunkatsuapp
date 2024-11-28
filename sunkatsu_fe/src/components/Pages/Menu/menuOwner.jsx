import React from "react";

import Navbar from "../../Fragment/Navbar";
import FilterCategory from "../../Fragment/filterCategory";
import NewMenuCard from "../../Fragment/newMenuCard";
import NewLandingFooter from "../../Fragment/newLandingFooter";

import { GlobalProvider } from "../../../context/GlobalContext";
import EditMenu from "../../Fragment/popupEditMenu";

const MenuOwner = () => {
    const menuItems = ["All", "Food", "Drink", "Dessert"];

    return(
        <div>
            <div>
            <Navbar />
            <FilterCategory menuItems={menuItems} />
            <NewMenuCard />
            if (onClick){
                <EditMenu />
            }
            </div>
        <NewLandingFooter />            
        </div>
    )
};

export default MenuOwner;