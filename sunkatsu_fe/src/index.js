import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeCustomer from './Pages/homeCust';

const router = createBrowserRouter([
  {
    path: "/homeCustomer",
    element: <HomeCustomer />,
  },
]); 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

