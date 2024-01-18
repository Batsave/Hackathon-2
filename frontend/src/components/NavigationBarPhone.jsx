import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";
import Chatbot from "../pages/Chatbot";

import "../scss/components/NavigationBarPhone.scss";

export default function Header() {
  const [navState, setNavState] = useState(false);
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
          console.info("Log Out in progress...");
          window.location.href = "/logout";
        } else {
          console.info("Log Out impossible");
        }
      });
  }

  // const maintenant = new Date();
  // const dateFormatee = maintenant.toLocaleDateString("fr-FR", options);

  useEffect(() => {
    const navBox = document.querySelector(".NavigationPhone");
    if (navState === true) {
      navBox.classList.add("NavigationPhone_active");
    } else {
      navBox.classList.remove("NavigationPhone_active");
    }
  }, [navState]);

  return (
    <>
      <div className="NavigationPhone">
        <div className="NavigationPhone_main">
          <div className="NavigationPhone_main_head">
            <Link to="/" className="NavigationPhone_main_head_logo" />
            <div className="NavigationPhone_main_head_btn">
              <button
                type="button"
                className="Navigation_main_container_logout_btn LorIAmobile"
                onClick={() => setIsChatbotVisible(!isChatbotVisible)}
                aria-label="Toggle Chatbot"
              >
                {" "}
              </button>

              <input
                type="checkbox"
                id="nav-toggle"
                className="nav-toggle"
                onClick={() => setNavState((prev) => !prev)}
              />
              <label htmlFor="nav-toggle" className="nav-toggle-label">
                {}
              </label>
            </div>
          </div>
          <div className="NavigationPhone_main_container">
            <div className="NavigationPhone_main_container_menu">
              <hr className="Separate" />
              <NavLink to="/home" className="linkTo" activeclassname="active">
                <div className="home_NavIcon NavIco" />
                <p className="title">Home</p>
              </NavLink>
              <NavLink
                to="/account"
                className="linkTo"
                activeclassname="active"
              >
                <div className="account_NavIcon NavIco" />
                <p className="title">Account</p>
              </NavLink>
              <NavLink
                to="/products"
                className="linkTo"
                activeclassname="active"
              >
                <div className="products_NavIcon NavIco" />
                <p className="title">Products</p>
              </NavLink>
              <NavLink to="/orders" className="linkTo" activeclassname="active">
                <div className="order_NavIcon NavIco" />
                <p className="title">Orders</p>
              </NavLink>
              <hr className="Separate" />
            </div>
            <div className="NavigationPhone_main_container_logout">
              <button
                type="button"
                className="NavigationPhone_main_container_logout_btn"
                onClick={handleLogOut}
              >
                <div className="LogOutBtn" />
                <span className="LogOutTitle"> Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Chatbot className="chatbotcss" isVisible={isChatbotVisible} />
    </>
  );
}
