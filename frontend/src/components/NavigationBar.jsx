import React from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";

import "../scss/components/NavigationBar.scss";

export default function Header() {
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

  return (
    <div className="Navigation">
      <div className="Navigation_main">
        <div className="Navigation_main_head">
          <Link to="/" className="Navigation_main_head_logo" />
        </div>
        <div className="Navigation_main_container">
          <div className="Navigation_main_container_menu">
            <hr className="Separate" />
            <NavLink to="/admin" className="linkTo" activeclassname="active">
              <div className="admin_NavIcon NavIco" />
            </NavLink>
            <NavLink to="/clients" className="linkTo" activeclassname="active">
              <div className="client_NavIcon NavIco" />
            </NavLink>
            <NavLink
              to="/giftcards"
              className="linkTo"
              activeclassname="active"
            >
              <div className="giftcard_NavIcon NavIco" />
            </NavLink>
            <NavLink to="/email" className="linkTo" activeclassname="active">
              <div className="email_NavIcon NavIco" />
            </NavLink>
            <hr className="Separate" />
          </div>
          <div className="Navigation_main_container_logout">
            <button
              type="button"
              className="Navigation_main_container_logout_btn LogOutBtn"
              onClick={handleLogOut}
            >
              {}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
