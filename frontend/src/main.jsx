import React from "react";

import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/404";

import Home from "./pages/Home";

import EmailManual from "./pages/Email/EmailManual";
import EmailSent from "./pages/EmailSent";
import EmailError from "./pages/EmailError";

import SignIn from "./pages/Auth/SignIn";
import SuccessAuth from "./pages/Auth/SuccessAuth";
import SuccessLogOut from "./pages/Auth/SuccessLogOut";
import CreateAccount from "./pages/Auth/[NOTUSE]CreateAccount";

import Clients from "./pages/Clients/Clients";
import ClientId from "./pages/Clients/ClientId";
import AddClient from "./pages/Clients/AddClient";
import DeleteClient from "./pages/Clients/DeleteClient";
import SuccessDeleteClient from "./pages/Clients/SuccessDelete";

import Giftcards from "./pages/Giftcards/Giftcards";
import AddGiftcard from "./pages/Giftcards/AddGiftcard";
import GiftcardID from "./pages/Giftcards/GiftcardId";
import DeleteGiftcard from "./pages/Giftcards/DeleteGiftcard";
import SuccessDeleteGiftcard from "./pages/Giftcards/SuccessDelete";
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
        path: "/create",
        element: <CreateAccount />,
      },
      // Error Section
      {
        path: "*",
        element: <ErrorPage />,
      },

      // Contact Section
      {
        path: "/email",
        element: <EmailManual />,
      },
      {
        path: "/email-sent",
        element: <EmailSent />,
      },
      {
        path: "/email-error",
        element: <EmailError />,
      },

      // Auth Section

      {
        path: "/success-auth",
        element: <SuccessAuth />,
      },
      {
        path: "/logout",
        element: <SuccessLogOut />,
      },

      // Admin Section
      {
        path: "/home",
        element: <Home />,
      },

      // Clients Section
      {
        path: "/clients",
        element: <Clients />,
      },
      {
        path: "/clients/add",
        element: <AddClient />,
      },
      {
        path: "/clients/:id",
        element: <ClientId />,
      },
      {
        path: "/clients/:id/delete",
        element: <DeleteClient />,
      },
      {
        path: "/success-delete-client",
        element: <SuccessDeleteClient />,
      },

      // Clients Section
      {
        path: "/giftcards",
        element: <Giftcards />,
      },
      {
        path: "/giftcards/add",
        element: <AddGiftcard />,
      },
      {
        path: "/giftcards/:id",
        element: <GiftcardID />,
      },
      {
        path: "/giftcards/:id/delete",
        element: <DeleteGiftcard />,
      },
      {
        path: "/success-delete-giftcard",
        element: <SuccessDeleteGiftcard />,
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
