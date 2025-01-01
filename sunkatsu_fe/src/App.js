import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";
import { ProtectedRoute } from "./components/Utils/protectedRoute";


import Login from "./components/Pages/Register/login";

import Home from "./components/Pages/Home/home";

import MenuCustomer from "./components/Pages/Menu/menuCustomer";
import MenuStaff from "./components/Pages/Menu/menuStaff";
import MenuOwner from "./components/Pages/Menu/menuOwner";
import Payment from "./components/Pages/Dashboard/payment";
import PaymentDone from "./components/Pages/Dashboard/paymentDone";

import Chat from "./components/Pages/Dashboard/chat";
import TestPage from "./components/Pages/Dashboard/testpage";
import Menu from "./components/Pages/Menu/menu";
import LandingPage from "./components/Pages/Home/home";
import Cart from "./components/Pages/Dashboard/cart";
import Order from "./components/Pages/Dashboard/myorder";
import Profile from "./components/Pages/Dashboard/userProfile";
import Signup from "./components/Pages/Register/signup";

function App() {
  return (
    <>
      <GlobalProvider>
        <Router>
          <Routes>
            <Route
              path="/signup"
              element={
                <ProtectedRoute requiresAuth={false}>
                  <Signup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute requiresAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/menuCustomer" element={<MenuCustomer />} />
            <Route path="/menuStaff" element={<MenuStaff />} />
            <Route path="/menuOwner" element={<MenuOwner />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute requiresAuth={true}>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/menu"
              element={
                <ProtectedRoute requiresAuth={true}>
                  <Menu />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order"
              element={
                <ProtectedRoute requiresAuth={true}>
                  <Order />
                </ProtectedRoute>
              }
            />
            <Route path="/payment" element={<Payment />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </GlobalProvider>
      {/* <AuthComponent /> */}
    </>
  );
}

export default App;
