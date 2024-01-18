import React from "react";

import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/404";

import Home from "./pages/Home";

import SignIn from "./pages/Auth/SignIn";
import SuccessAuth from "./pages/Auth/SuccessAuth";
import SuccessLogOut from "./pages/Auth/SuccessLogOut";

import Products from "./pages/Products/Products";

import Orders from "./pages/Orders/Orders";

import Chatbot from "./pages/Chatbot";

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
                                                                             

____________________________________________________________________

©️ Developed by TrueKiLeak - 2024 - HACKATHON 2024
____________________________________________________________________

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

      // Products Section
      {
        path: "/products/",
        element: <Products />,
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
