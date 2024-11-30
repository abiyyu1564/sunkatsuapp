import React from "react";

import Navbar from "../../fragments/Navbar";
import FilterCategory from "../../Fragment/filterCategory";
import NewMenuCard from "../../Fragment/newMenuCard";
import NewLandingFooter from "../../Fragments/Footer";

import { GlobalProvider } from "../../../context/GlobalContext";

const MenuCustomer = () => {
    const menuItems = ["All", "Food", "Drink", "Dessert"];
    const menu = ['Food', 'Drink', 'Dessert'];
    return(
        <div>
            <div>
            <Navbar />
            <FilterCategory menuItems={menuItems} />
            <NewMenuCard />
            </div>
        <NewLandingFooter />            
        </div>
    )
};

export default MenuCustomer;