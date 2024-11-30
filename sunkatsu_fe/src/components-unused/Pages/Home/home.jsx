import React from "react";
import NewLanding from "../../Fragment/newLanding";
import NewLandingFooter from "../../Fragments/Footer";
import Navbar from "../../Fragments/Navbar";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <NewLanding />
      <NewLandingFooter />
    </>
  );
};

export default LandingPage;
