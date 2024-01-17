import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";

import "../scss/components/NavigationBar.scss";

export default function Header() {
  const [NavState, setNavState] = useState(false);

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
          console.info("Déconnexion en cours...");
          window.location.href = "/logout";
        } else {
          console.info("Impossible de se déconnecter");
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
            <NavLink to="/admin" className="linkTo" activeclassname="active">
              <div className="admin_NavIcon NavIco" />
              <p className="LinkName">Accueil</p>
            </NavLink>
            <NavLink to="/clients" className="linkTo" activeclassname="active">
              <div className="client_NavIcon NavIco" />
              <p className="LinkName">Compte</p>
            </NavLink>
            <NavLink
              to="/giftcards"
              className="linkTo"
              activeclassname="active"
            >
              <div className="giftcard_NavIcon NavIco" />
              <p className="LinkName">Produits</p>
            </NavLink>
            <NavLink to="/email" className="linkTo" activeclassname="active">
              <div className="email_NavIcon NavIco" />
              <p className="LinkName">Commandes</p>
            </NavLink>
            <hr className="Separate" />
          </div>
          <div className="Navigation_main_container_logout">
            <button
              type="button"
              id="NavigationState"
              className="OpenBar Navigation_main_container_logout_btn"
              onClick={() => setNavState(!NavState)}
            >
              <p className="TextGapDeconnexion">Fermer</p>
            </button>
            <button
              type="button"
              className="Navigation_main_container_logout_btn LogOutBtn"
              onClick={handleLogOut}
            >
              <p className="TextGapDeconnexion">Déconnexion</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
