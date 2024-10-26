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

function App() {
  return (
    <>
      <NavbarLanding />
      <HeroLanding />
      <MenuDetail />
      <CustomerHistoryCard />
      <StaffHistoryCard />
    </>
  );
}

export default App;
