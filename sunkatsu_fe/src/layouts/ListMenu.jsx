import React from "react";
import NewMenuCard from "../components/Fragment/newMenuCard";
import NewLandingFooter from "../fragments/Footer";
import Navbar from "../fragments/Navbar";

const ListMenu = () => {
  return (
    <>
      <Navbar/>
      <NewMenuCard />
      <NewLandingFooter />
    </>
  );
};

export default ListMenu;
