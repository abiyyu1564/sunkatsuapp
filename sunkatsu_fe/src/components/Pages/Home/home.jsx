import React from "react";
import NewLanding from "../../Fragment/newLanding";
import NewLandingFooter from "../../Fragment/newFooter";
import Navbar from "../../Fragment/Navbar";
import Chatbot from "../../Fragment/popupChatbot";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Chatbot />
      <NewLanding />
      <NewLandingFooter />
    </>
  );
};

export default LandingPage;
