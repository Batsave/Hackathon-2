import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../scss/auth/SignInPage.scss";
import ScrollToTop from "../ResetScrollOnPage";

export default function SignIn() {
  // Verification si l'utilisateur est connécté et si son token est toujours valide
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checktoken`,
        "CheckMePlease",
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.message === "OK") {
          console.info("Connexion Approuvée");
          window.location.href = "/admin";
        }
      });
  }, []);

  // INIT le stockage des informations de connexion
  // -----------------------------------------------------------------------------------------------
  const [details, setDetails] = useState({
    email: "",
  });

  // Verification de l'email
  // -----------------------------------------------------------------------------------------------
  const isEmailValid = (value) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,4}$/;
    return emailPattern.test(value);
  };

  // Fonction de Stockage des informations de connexion
  // -----------------------------------------------------------------------------------------------
  const handleDetailsChange = (event) => {
    const { name, value } = event.target;

    setDetails((prevDetails) => {
      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  // Fonction de protection contre les attaques XSS
  // -----------------------------------------------------------------------------------------------
  function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, function toMatch(match) {
      switch (match) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return match;
      }
    });
  }

  // Fonction de connexion
  // -----------------------------------------------------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!isEmailValid(details.email)) {
        document.getElementById("errorLog").innerText = "";
        document.getElementById("errorEmail").innerText =
          "Votre Email n'est pas valide";
        document.getElementById("email").classList.add("errorOnPlaceholder");
      } else {
        document.getElementById("errorEmail").innerText = "";
        document.getElementById("errorLog").innerText = "";
        document.getElementById("email").classList.remove("errorOnPlaceholder");

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/login`,
          {
            email: escapeHtml(details.email),
            password: escapeHtml(details.password),
          },
          { withCredentials: true }
        );
        // Gérez ici la réponse et le stockage du token
        // -------------------------------

        // -------------------------------
        console.info(response.data.message);
        document.getElementById("successLog").innerText =
          "Authentification en cours...";

        localStorage.setItem("EpimeleiaAdminToken", response.data.token);

        setTimeout(() => {
          window.location.href = "/success-auth";
        }, 500);
      }
    } catch (error) {
      document.getElementById("errorLog").innerText =
        error.response.data.message;
    }
  };

  return (
    <div className="SignInMain">
      <ScrollToTop />

      <div className="SignIn_container ">
        <img
          src="assets/svg/favicon.svg"
          alt="logo"
          className="SignIn_container_logo_ico"
        />
        <div className="SignIn_container_title">
          <h1>Connexion</h1>
        </div>
        <form className="SignIn_container_form">
          <div className="SignIn_container_form_box">
            <div className="form_placeholder">
              <p className="form_placeholder_title">Email</p>
              <input
                className="form_placeholder_input"
                name="email"
                id="email"
                value={details.email || ""}
                onChange={handleDetailsChange}
                type="email"
                placeholder="john_doe@exemple.com"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,4}$"
                required
              />
            </div>
            <div className="form_placeholder form_final">
              <p className="form_placeholder_title">Mot de Passe</p>
              <input
                className="form_placeholder_input"
                name="password"
                id="password"
                value={details.password || ""}
                onChange={handleDetailsChange}
                maxLength="32"
                minLength="8"
                type="password"
                placeholder="***"
                autoComplete="true"
                aria-current="true"
                required
              />
            </div>
          </div>
          <div className="form_buttons">
            <button
              type="button"
              disabled={!details.email || !details.password}
              onClick={handleSubmit}
              className="signIn"
            >
              Se connecter
            </button>
          </div>
          <p className="error_container" id="errorEmail" />
          <p className="error_container" id="errorLog" />
          <p className="success_container" id="successLog" />
        </form>
      </div>
    </div>
  );
}
