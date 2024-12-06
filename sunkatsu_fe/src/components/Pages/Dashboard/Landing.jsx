import React from "react";
import NewLanding from "../../Fragment/newLanding";
import NewNavbar from "../../Fragment/newLandingNavbar";
import NewLandingFooter from "../../Fragment/newLandingFooter";

const LandingPage = () => {
  return (
    <>
      <NewNavbar />
      <NewLanding />
      <NewLandingFooter />
    </>
  );
};

export default LandingPage;
