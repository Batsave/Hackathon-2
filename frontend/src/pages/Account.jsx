import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";

import Navigation from "../components/NavigationBar";
import NavigationPhone from "../components/NavigationBarPhone";
import ScrollToTop from "./ResetScrollOnPage";

import UserInformation from "../components/Account/UserInformation";
import UserModification from "../components/Account/UserModification";

import mailError from "../assets/LottieFiles/EmailError.json";

import "../scss/account.scss";

export default function Account() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const CheckMe = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/checktoken`,
          "CheckMePlease",
          {
            withCredentials: true,
          }
        );
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setTimeout(() => {
          window.location.href = "/";
        }, 3800);
      }
      setIsLoading(false);
    };

    CheckMe();
  }, []);
  // Checking if the user is logged in and if their token is still valid
  // -----------------------------------------------------------------------------------------------
  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <section>
        <div className="containererror">
          <Lottie
            loop
            animationData={mailError}
            play
            style={{ width: 120, height: 120 }}
          />
          <h1>Access Denied</h1>
          <p className="message">
            {`
          You are not authorized to access this page.`}
            <br /> `You will be redirected to the login page.`
          </p>
        </div>
      </section>
    ); // or render a login component
  }
  return (
    <main id="MainContent">
      <ScrollToTop />
      <Navigation />
      <NavigationPhone />
      <h1 className="accountTitle">My Account</h1>
      <UserInformation />
      <UserModification />
    </main>
  );
}
