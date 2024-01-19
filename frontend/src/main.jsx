import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/404";
import Home from "./pages/Home";
import Account from "./pages/Account";

import SignIn from "./pages/Auth/SignIn";
import SuccessAuth from "./pages/Auth/SuccessAuth";
import SuccessLogOut from "./pages/Auth/SuccessLogOut";

import Products from "./pages/Products/Products";

import Orders from "./pages/Orders/Orders";

import Chatbot from "./pages/Chatbot";
import ProductDetails from "./pages/Products/ProductDetails";

console.info(`
██╗      ██████╗ ██████╗ ███████╗ █████╗ ██╗         ██████╗ ██████╗ ██████╗ 
██║     ██╔═══██╗██╔══██╗██╔════╝██╔══██╗██║         ██╔══██╗╚════██╗██╔══██╗
██║     ██║   ██║██████╔╝█████╗  ███████║██║         ██████╔╝ █████╔╝██████╔╝
██║     ██║   ██║██╔══██╗██╔══╝  ██╔══██║██║         ██╔══██╗██╔═══╝ ██╔══██╗
███████╗╚██████╔╝██║  ██║███████╗██║  ██║███████╗    ██████╔╝███████╗██████╔╝
╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝    ╚═════╝ ╚══════╝╚═════╝ 
                                                                             
██╗███╗   ██╗████████╗███████╗██████╗ ███████╗ █████╗  ██████╗███████╗       
██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝       
██║██╔██╗ ██║   ██║   █████╗  ██████╔╝█████╗  ███████║██║     █████╗         
██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔══╝  ██╔══██║██║     ██╔══╝         
██║██║ ╚████║   ██║   ███████╗██║  ██║██║     ██║  ██║╚██████╗███████╗       
╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝       
                                                                             

_____________________________________________________________________________

©️ Developed by TrueKiLeak - 2024 - HACKATHON 2024
Deployed by AnthoGorski | Sponsoring by L'Oreal Europe
Website Host by Wild Code School | 2024
_____________________________________________________________________________

`);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <SignIn />,
      },
      {
        path: "/success-auth",
        element: <SuccessAuth />,
      },
      {
        path: "/logout",
        element: <SuccessLogOut />,
      },

      // Error Section
      {
        path: "*",
        element: <ErrorPage />,
      },

      // Admin Section
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/account",
        element: <Account />,
      },

      // Products Section
      {
        path: "/products/",
        element: <Products />,
      },
      {
        path: "/products/:id",
        element: <ProductDetails />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/chatbot",
        element: <Chatbot />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={router} />);
