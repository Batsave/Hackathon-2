import React, { useState, useEffect } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import Lottie from "react-lottie-player";
import "../../scss/clients/addclient.scss";
import Navigation from "../../components/NavigationBar";
import NavigationPhone from "../../components/NavigationBarPhone";
import AlertBox from "../../components/alertBox/alertBox";
import ScrollToTop from "../ResetScrollOnPage";
import mailError from "../../assets/LottieFiles/EmailError.json";

export default function AddClient() {
  // Stockage des données de connexion
  // ------------------------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Stockage des données du formulaire
  // ------------------------------------------------------------------------------------------
  const [details, setDetails] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    codePostal: "",
    ville: "",
    notes: "",
  });

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

  // Regex
  // ------------------------------------------------------------------------------------------
  const isNomValid = (value) => {
    const nomPattern = /^[A-Za-z '-]{2,50}$/;
    return nomPattern.test(value);
  };
  const isPrenomValid = (value) => {
    const prenomPattern = /^[A-Za-z '-]{2,50}$/;
    return prenomPattern.test(value);
  };
  const isEmailValid = (value) => {
    if (!value) {
      return true;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,4}$/;
    return emailPattern.test(value);
  };
  const isTelephoneValid = (value) => {
    if (!value) {
      return true;
    }
    const telephonePattern = /^[+]?[0-9\s-]+/;
    return telephonePattern.test(value);
  };

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
      if (!isNomValid(details.nom)) {
        alertBox({
          type: "warning",
          entete: "🤭 Oups !",
          message: "Le nom est invalide !",
        });
      } else {
        setAlertType("");

        if (!isPrenomValid(details.prenom)) {
          alertBox({
            type: "warning",
            entete: "🤭 Oups !",
            message: "Le prenom est invalide !",
          });
        } else {
          setAlertType("");

          if (!isTelephoneValid(details.telephone)) {
            alertBox({
              type: "warning",
              entete: "🤭 Oups !",
              message: "Le numéro de téléphone est invalide !",
            });
          } else {
            setAlertType("");
            if (details.telephone.includes("+33")) {
              details.telephone = details.telephone.replace("+33", "0");
              if (details.telephone.startsWith("00")) {
                details.telephone = details.telephone.replace("00", "0");
              }
            }
            if (!isEmailValid(details.email)) {
              alertBox({
                type: "warning",
                entete: "🤭 Oups !",
                message: "L'email est invalide !",
              });
            } else {
              setAlertType("");

              const response = await axios.post(
                "http://localhost:3310/api/client/add",
                {
                  nom: escapeHtml(details.nom),
                  prenom: escapeHtml(details.prenom),
                  telephone: escapeHtml(details.telephone),
                  email: escapeHtml(details.email),
                  adresse: escapeHtml(details.adresse),
                  code_postal: escapeHtml(details.codePostal),
                  ville: escapeHtml(details.ville),
                  notes: escapeHtml(details.notes),
                },
                {
                  withCredentials: true,
                }
              );

              alertBox({
                type: "success",
                entete: "🚀 Client ajouté !",
                message: "Le client a été enregistré avec succès !",
                link: response.data.id,
              });
              setDetails({
                nom: "",
                prenom: "",
                email: "",
                telephone: "",
                adresse: "",
                codePostal: "",
                ville: "",
                notes: "",
              });
            }
          }
        }
      }
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

  // Vérifier si l'utilisateur est connecté
  // ------------------------------------------------------------------------------------------
  useEffect(() => {
    const CheckAuth = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/checktoken`,
          "CheckMePlease",
          {
            withCredentials: true,
          }
        );
        if (response.data.message === "OK") {
          setIsLoggedIn(true);
        } else throw new Error("Accès refusé");
      } catch (error) {
        setIsLoggedIn(false);
        setTimeout(() => {
          window.location.href = "/";
        }, 3800);
      }
      setIsLoading(false);
    };

    CheckAuth();
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
    ); // or render a login component
  }

  return (
    <main>
      <Navigation />
      <NavigationPhone />
      <ScrollToTop />
      <div className="Add_container">
        <div className="Add_grid_content">
          <div className="Add_grid_content_explain">
            <h1>Ajouter un nouveau client</h1>
            <Markdown className="paragraphe">
              {`Remplis le formulaire ci contre pour ajouter un client.
              Les champs marqués d'une étoile sont obligatoires.`}
            </Markdown>
            <Markdown className="paragraphe">
              {`**Si le client existe déjà, il ne sera pas ajouter.** 
              Un client existe déjà si son nom et son prenom ou son adresse mail ou son 
              téléphone est déjà enregistré dans la base de données.`}
            </Markdown>
          </div>
          <form className="Add_grid_content_form">
            <div className="Add_grid_content_form_box">
              <h2 className="CategoryTitle">Informations Client</h2>
              {/* Nom */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Nom *</p>
                <input
                  className="form_placeholder_input"
                  name="nom"
                  id="nom"
                  value={details.nom || ""}
                  onChange={handleDetailsChange}
                  type="text"
                  placeholder="Doe"
                  pattern="[A-Za-z '-]{2,50}"
                  required
                />
              </div>
              {/* Prénom */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Prénom *</p>
                <input
                  className="form_placeholder_input"
                  name="prenom"
                  id="prenom"
                  value={details.prenom || ""}
                  onChange={handleDetailsChange}
                  type="text"
                  placeholder="John"
                  pattern="[A-Za-z '-]{2,50}"
                  required
                />
              </div>
              {/* Téléphone */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Téléphone *</p>
                <input
                  className="form_placeholder_input"
                  name="telephone"
                  id="telephone"
                  value={details.telephone || ""}
                  onChange={handleDetailsChange}
                  type="phone"
                  placeholder="0506070809"
                  pattern="[+]?[0-9\s-]+"
                  required
                />
              </div>
              {/* Email */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Email *</p>
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
              {/* Adresse */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Adresse</p>
                <input
                  className="form_placeholder_input"
                  name="adresse"
                  id="adresse"
                  value={details.adresse || ""}
                  onChange={handleDetailsChange}
                  type="text"
                  placeholder="2 rue de la paix"
                  pattern="[A-Za-z0-9\s,.-]+"
                />
              </div>
              {/* Code Postal */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Code Postal</p>
                <input
                  className="form_placeholder_input"
                  name="codePostal"
                  id="code_postal"
                  value={details.codePostal || ""}
                  onChange={handleDetailsChange}
                  type="text"
                  placeholder="70000"
                  pattern="[0-9\s-]{1,6}"
                />
              </div>
              {/* Ville */}
              <div className="form_placeholder form_final">
                <p className="form_placeholder_title">Ville</p>
                <input
                  className="form_placeholder_input"
                  name="ville"
                  id="ville"
                  value={details.ville || ""}
                  onChange={handleDetailsChange}
                  type="text"
                  placeholder="Mortagne sur Sèvre"
                  pattern="[A-Za-z0-9\s,.-À-ÿ]+"
                />
              </div>
            </div>
            <div className="Add_grid_content_notes_box">
              <h3 className="CategoryTitle">Notes</h3>
              {/* Notes */}
              <div className="form_placeholder">
                <textarea
                  className="form_placeholder_textarea "
                  name="notes"
                  id="notes"
                  value={details.notes || ""}
                  onChange={handleDetailsChange}
                  type="text"
                />
                <div className="form_buttons">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="signIn"
                  >
                    Ajouter le client
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <AlertBox
        displayMode={displayMode}
        className="AlertBox"
        entete={AlerteEntete}
        type={AlertType}
        message={AlertMessageSuccess}
        link={AlertLink}
      />
    </main>
  );
}
