import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";
import Chatbot from "../pages/Chatbot";

import "../scss/components/NavigationBar.scss";

export default function Header() {
  const [NavState, setNavState] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  function handleLogOut() {
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        "LogOutMePlease",
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.message === "OK") {
          console.info("Log out in progress...");
          window.location.href = "/logout";
        } else {
          console.info("Log out failed");
        }
      });
  }

  useEffect(() => {
    const NavigationStateButton = document.querySelector("#NavigationState");
    const NavigationBox = document.querySelector("#NavBox");
    const MainContent = document.querySelector("#MainContent");
    const Logo = document.querySelector("#logo");

    if (NavState) {
      NavigationStateButton.classList.remove("OpenBar_icon");
      NavigationStateButton.classList.add("CloseBar_icon");
      NavigationBox.classList.add("Open");
      MainContent.classList.add("open");
      Logo.classList.add("logoOpen");
    }
    if (!NavState) {
      NavigationStateButton.classList.remove("CloseBar_icon");
      NavigationStateButton.classList.add("OpenBar_icon");
      NavigationBox.classList.remove("Open");
      MainContent.classList.remove("open");
      Logo.classList.remove("logoOpen");
    }
  }, [NavState]);

  return (
    <div id="NavBox" className="Navigation">
      <div className="Navigation_main">
        <div className="Navigation_main_head">
          <Link to="/" id="logo" className="Navigation_main_head_logo" />
        </div>
        <div className="Navigation_main_container">
          <div className="Navigation_main_container_menu">
            <hr className="Separate" />
            <NavLink to="/home" className="linkTo" activeclassname="active">
              <div className="home_NavIcon NavIco" />
              <p className="LinkName">Home</p>
            </NavLink>
            <NavLink to="/account" className="linkTo" activeclassname="active">
              <div className="account_NavIcon NavIco" />
              <p className="LinkName">Account</p>
            </NavLink>
            <NavLink to="/products" className="linkTo" activeclassname="active">
              <div className="products_NavIcon NavIco" />
              <p className="LinkName">Products</p>
            </NavLink>
            <NavLink to="/orders" className="linkTo" activeclassname="active">
              <div className="order_NavIcon NavIco" />
              <p className="LinkName">Orders</p>
            </NavLink>
            <hr className="Separate" />
          </div>
          <div className="Navigation_main_container_logout">
            <button
              type="button"
              className="Navigation_main_container_logout_btn LorIA"
              onClick={() => setIsChatbotVisible(!isChatbotVisible)}
              aria-label="Toggle Chatbot"
            />
            <Chatbot className="chatbotcss" isVisible={isChatbotVisible} />
            <button
              type="button"
              id="NavigationState"
              className="OpenBar Navigation_main_container_logout_btn"
              onClick={() => setNavState(!NavState)}
            >
              <p className="TextGapDeconnexion">Close</p>
            </button>
            <button
              type="button"
              className="Navigation_main_container_logout_btn LogOutBtn"
              onClick={handleLogOut}
            >
              <p className="TextGapDeconnexion">Log Out</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
