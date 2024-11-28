import React from "react";
import Navbar from "../../Fragment/Navbar";
import NewLandingFooter from "../../Fragment/newLandingFooter";
import NewMenuCard from "../../Fragment/newMenuCard";

const Home = () => {
  return (
    <>
      <Navbar />
      <NewMenuCard />
      <NewLandingFooter />
    </>
  );
};

export default Home;
