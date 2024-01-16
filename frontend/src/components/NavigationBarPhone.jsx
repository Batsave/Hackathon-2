import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";

import "../scss/components/NavigationBarPhone.scss";

export default function Header() {
  const [navState, setNavState] = useState(false);
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
    <div className="NavigationPhone">
      <div className="NavigationPhone_main">
        <div className="NavigationPhone_main_head">
          <Link to="/" className="NavigationPhone_main_head_logo" />
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
        <div className="NavigationPhone_main_container">
          <div className="NavigationPhone_main_container_menu">
            <hr className="Separate" />
            <NavLink to="/admin" className="linkTo" activeclassname="active">
              <div className="admin_NavIcon NavIco" />
              <p className="title">Admin</p>
            </NavLink>
            <NavLink to="/clients" className="linkTo" activeclassname="active">
              <div className="client_NavIcon NavIco" />
              <p className="title">Clients</p>
            </NavLink>
            <NavLink
              to="/giftcards"
              className="linkTo"
              activeclassname="active"
            >
              <div className="giftcard_NavIcon NavIco" />
              <p className="title">Cartes Cadeau</p>
            </NavLink>
            <NavLink to="/email" className="linkTo" activeclassname="active">
              <div className="email_NavIcon NavIco" />
              <p className="title">Emails</p>
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
              <span className="LogOutTitle"> Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
