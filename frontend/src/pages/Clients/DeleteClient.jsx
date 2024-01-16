import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";
import Markdown from "react-markdown";
import { useParams } from "react-router-dom";

import AlertBox from "../../components/alertBox/alertBox";
import mailError from "../../assets/LottieFiles/EmailError.json";

import "../../scss/clients/deleteclient.scss";

export default function DeleteClient() {
  // Stockage des informations de connexion
  // -----------------------------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { id } = useParams();

  const [details, setDetails] = useState({
    password: "",
  });
  const [clientData, setClientData] = useState([]);
  const [clientFound, setClientFound] = useState(false);

  // Alerte Box Configurations
  // ------------------------------------------------------------------------------------------
  const [displayMode, setDisplayMode] = useState("none");
  const [AlertType, setAlertType] = useState("");
  const [AlerteEntete, setAlerteEntete] = useState("");
  const [AlertMessageSuccess, setAlertMessageSuccess] = useState("");
  const [AlertLink, setAlertLink] = useState("");

  // Alerte Box Configurations
  // ------------------------------------------------------------------------------------------
  function alertBox({ type, entete, message }) {
    setDisplayMode("flex");
    setAlertType(type);
    setAlerteEntete(entete);
    setAlertMessageSuccess(message);
    setTimeout(() => {
      setDisplayMode("none");
      setAlertType("");
      setAlerteEntete("");
      setAlertMessageSuccess("");
      setAlertLink("");
    }, 5400);
  }

  // Mettre a jour les données dans le state en fonction des changements dans le formulaire
  // ------------------------------------------------------------------------------------------
  const handleDetailsChange = (event) => {
    const { name, value } = event.target;
    setDetails((prevDetails) => {
      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  // Formater pour évité les requettes HTML
  // ------------------------------------------------------------------------------------------
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

  // Soumettre le formulaire
  // ------------------------------------------------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/client/delete/${id}`,
        {
          password: escapeHtml(details.password),
        },
        {
          withCredentials: true,
        }
      );
      console.info(response);

      window.location.href = "/success-delete-client";
    } catch (error) {
      alertBox({
        type: "error",
        entete: "🚫 Erreur !",
        message: error.response?.data?.message
          ? error.response.data.message
          : error.message,
      });
    }
  };

  // Verification si l'utilisateur est connécté et si son token est toujours valide
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const getClientsList = async () => {
      try {
        const res1 = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/client/${id}`,
          {
            withCredentials: true,
          }
        );
        setIsLoggedIn(true);
        setClientFound(true);
        setClientData(res1.data.client);
      } catch (error) {
        setIsLoggedIn(false);
        setClientFound(false);
        setTimeout(() => {
          window.location.href = "/clients";
        }, 3800);
      }
    };
    getClientsList();
    setIsLoading(false);
  }, []);

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
          <h1>Accès Impossible</h1>
          <p className="message">
            {`
          Vous n'êtes pas autorisé(e) à acceder a cette page.  `}
            <br /> {` Vous allez être redirigé(e) vers la page de connexion. `}
          </p>
        </div>
      </section>
    );
  }

  if (!clientFound) {
    return (
      <section>
        <div className="containererror">
          <Lottie
            loop
            animationData={mailError}
            play
            style={{ width: 120, height: 120 }}
          />
          <h1>Ce client n'existe pas</h1>
          <p className="message">
            {`
          Nous n'avons pas trouvé ce client dans la base de données.  `}
            <br /> {` Vous allez être redirigé(e) vers la liste des clients. `}
          </p>
        </div>
      </section>
    );
  }
  return (
    <div>
      <div className="Delete_container">
        <form className="Delete_container_form">
          <Markdown>{`Vous êtes sur le point de supprimer **${clientData.prenom} ${clientData.nom}** de votre base de données client.`}</Markdown>

          <Markdown>
            Merci de confirmer votre identitée en entrant votre mot de passe
            pour valider la suppression du client.
          </Markdown>
          <div className="Delete_container_form_box">
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
              onClick={() => {
                window.history.back(1);
              }}
              className="AbortDelete"
            >
              Annuler
            </button>
            <button
              type="button"
              disabled={!details.password}
              onClick={handleSubmit}
              className={!details.password ? "AwaitPassword" : "ConfirmDelete"}
            >
              Supprimer le client
            </button>
          </div>
          <p className="error_container" id="errorEmail" />
          <p className="error_container" id="errorLog" />
          <p className="success_container" id="successLog" />
        </form>
      </div>
      <AlertBox
        displayMode={displayMode}
        className="AlertBox"
        entete={AlerteEntete}
        type={AlertType}
        message={AlertMessageSuccess}
        link={AlertLink}
      />
    </div>
  );
}
