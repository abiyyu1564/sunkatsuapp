import React from "react";
import NewLanding from "../../Fragment/newLanding";
import NewLandingFooter from "../../Fragment/newFooter";
import Navbar from "../../Fragment/Navbar";

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
