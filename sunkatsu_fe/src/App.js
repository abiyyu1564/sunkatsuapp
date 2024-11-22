import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Fragment/Navbar";
import Hero from "./components/Fragment/hero";
import Hero2 from "./components/Fragment/hero2";
import Footer from "./components/Fragment/footer";
import Card from "./components/Fragment/menuCard";
import NavbarLanding from "./components/Fragment/NavbarLanding";
import HeroLanding from "./components/Fragment/heroLanding";
import MenuDetail from "./components/Fragment/menuDetail";
import CustomerHistoryCard from "./components/Fragment/customerHistoryCard";
import StaffHistoryCard from "./components/Fragment/staffHistoryCard";
import Loading from "./components/Fragment/loading";
import Login from "./components/Fragment/loginPage";
import Log from "./components/Fragment/login";
import FailLogin from "./components/Fragment/FailLogin";
import Sign from "./components/Fragment/signup";
import NewMenuCard from "./components/Fragment/newMenuCard";
import TestRemovebg from "./components/Fragment/testRemovebg";
import NewShoppingCart from "./components/Fragment/newShoppingCart";
import { GlobalProvider } from "./context/GlobalContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FilterCategory from "./components/Fragment/filterCategory";
import LandingPage from "./components/Layout/Landing";
import ListMenu from "./components/Layout/ListMenu";
import CobaInputMenu from "./components/Fragment/cobaInputMenu";
import NewLanding from "./components/Fragment/newLanding";
import NewLandingFooter from "./components/Fragment/newLandingFooter";
import Choice from "./components/Fragment/choiceMenu";

import Homepage from "./components/Pages/Dashboard/homePage";

function App() {
  const menuItems = ["All", "Minuman", "Desert"];
  return (
    <div>
      {/*
      <Router>
      <Routes>
      <Route path="/" element={<NewShoppingCart />} />
      </Routes>
      </Router>
      */}
      <Choice/>
    </div>
  );
}

export default App;
