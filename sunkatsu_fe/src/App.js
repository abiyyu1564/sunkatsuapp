import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";

import Sign from "./components/Pages/Register/signup";
import Login from "./components/Pages/Register/login";

import Home from "./components/Pages/Home/home";

import MenuCustomer from "./components/Pages/Menu/menuCustomer";
import MenuStaff from "./components/Pages/Menu/menuStaff";
import MenuOwner from "./components/Pages/Menu/menuOwner";

import Chat from "./components/Pages/Dashboard/chat";
import TestPage from "./components/Pages/Dashboard/testpage";

function App() {
  return (
    <>
      <GlobalProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<Sign />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/menuCustomer" element={<MenuCustomer />} />
            <Route path="/menuStaff" element={<MenuStaff />} />
            <Route path="/menuOwner" element={<MenuOwner />} />
            <Route path="/chat" element={<Chat />} />

            <Route path="/test" element={<TestPage />} />
          </Routes>
        </Router>
      </GlobalProvider>
    </>
  );
}

export default App;
