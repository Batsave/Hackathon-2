import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import axios from "axios";
import Markdown from "react-markdown";
import Lottie from "react-lottie-player";

import "../../scss/email/sendManual.scss";

import Navigation from "../../components/NavigationBar";
import NavigationPhone from "../../components/NavigationBarPhone";
import AlertBox from "../../components/alertBox/alertBox";
import ScrollToTop from "../ResetScrollOnPage";

import mailError from "../../assets/LottieFiles/EmailError.json";

export default function SendEmailClient() {
  const [clientsList, setClientsList] = useState([]);
  const [searchClientName, setSearchClientName] = useState("");
  // Stockage des données de connexion
  // ------------------------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Stockage des données du formulaire
  // ------------------------------------------------------------------------------------------
  const [details, setDetails] = useState({
    client_id: "",
    prenom: "",
    to: "",
    subject: "",
    text: "",
  });

  const handleSearchClientNameChange = (e) => {
    setSearchClientName(e.target.value);
  };

  const filteredClientName = clientsList.filter((client) => {
    const fullName = `${client.nom} ${client.prenom}`;
    return fullName.toLowerCase().includes(searchClientName.toLowerCase());
  });

  useEffect(() => {
    if (details.client_id === "") {
      setDetails((prevDetails) => {
        return {
          ...prevDetails,
          prenom: "",
        };
      });
    } else {
      const client = clientsList.find(
        (clients) => Number(clients.id) === Number(details.client_id)
      );
      if (client) {
        const { email, prenom } = client;
        setDetails((prevDetails) => {
          return {
            ...prevDetails,
            to: email,
            prenom,
          };
        });
      }
    }
  }, [details.client_id]);

  // Alerte Box Configurations
  // ------------------------------------------------------------------------------------------
  const [displayMode, setDisplayMode] = useState("none");
  const [AlertType, setAlertType] = useState("");
  const [AlerteEntete, setAlerteEntete] = useState("");
  const [AlertMessageSuccess, setAlertMessageSuccess] = useState("");
  const [AlertLink, setAlertLink] = useState("");

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
        `${import.meta.env.VITE_BACKEND_URL}/api/email/send`,
        {
          client_id: details.client_id,
          prenom: details.prenom,
          to: details.to,
          subject: escapeHtml(details.subject),
          text: escapeHtml(details.text),
        },
        {
          withCredentials: true,
        }
      );

      setDetails({
        client_id: "",
        prenom: "",
        to: "",
        subject: "",
        text: "",
      });

      alertBox({
        type: "success",
        entete: "🚀 Client ajouté !",
        message: "Le client a été enregistré avec succès !",
        link: response.data.id,
      });
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
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/client/email`,
          {
            withCredentials: true,
          }
        );
        if (response.data) {
          setIsLoggedIn(true);
          setClientsList(response.data);
        }
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
      <div className="SendEmail_container">
        <div className="SendEmail_grid_content">
          <div className="SendEmail_grid_content_explain">
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
          <form className="SendEmail_grid_content_form">
            <div className="SendEmail_grid_content_form_box">
              <h2 className="CategoryTitle">Informations Client</h2>
              {/* to */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Recherche</p>
                <input
                  className="form_placeholder_input"
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchClientName || ""}
                  onChange={handleSearchClientNameChange}
                />
              </div>
              <div className="form_placeholder">
                <p className="form_placeholder_title">Client</p>

                <select
                  className="form_placeholder_input"
                  name="client_id"
                  id="client_id"
                  value={details.client_id || ""}
                  onChange={handleDetailsChange}
                >
                  <option value="">--</option>

                  {filteredClientName.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nom} {client.prenom}
                    </option>
                  ))}
                </select>
              </div>
              {/* Prénom */}
              <div className="form_placeholder form_final">
                <p className="form_placeholder_title">Sujet</p>
                <input
                  className="form_placeholder_input"
                  name="subject"
                  id="subject"
                  value={details.subject || ""}
                  onChange={handleDetailsChange}
                  type="text"
                  placeholder="--"
                  required
                />
              </div>
            </div>
            <div className="SendEmail_grid_content_notes_box">
              <h3 className="CategoryTitle">Message</h3>
              {/* Notes */}
              <div className="form_placeholder">
                <textarea
                  className="form_placeholder_textarea "
                  name="text"
                  id="text"
                  value={details.text || ""}
                  onChange={handleDetailsChange}
                  type="text"
                />
                <div className="form_buttons">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="signIn"
                  >
                    Envoyer le message
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="SendEmail_render">
          <div className="SendEmail_render_box">
            <div className="Subject_section">
              <span />
              <div className="Subject_section_container">
                <h3 className="Subject_section_container_subject">
                  {details.subject}
                </h3>
                <img
                  src="/assets/svg/icons/mail_label.svg"
                  alt="label_icon"
                  width="20px"
                />
                <div className="mailbottle_name">Boîte de réception x</div>
              </div>
            </div>
            <div className="SendEmail_render_box_message">
              <div className="Sender_section">
                <img
                  src="/assets/svg/favicon.svg"
                  alt="Epimeleia Icon"
                  className="Sender_section_userlogo"
                />
                <div className="Sender_section_infos">
                  <p className="Sender_section_infos_name">
                    Epimeleia Massage{" "}
                    <span className="Sender_section_infos_email">{`<perrine.epimeleiamassage@gmail.com>`}</span>
                  </p>
                  <p className="Sender_section_infos_receveur">
                    A moi{" "}
                    <img
                      src="/assets/svg/icons/arrow_drop_down.svg"
                      alt="arrow"
                      className="symbol"
                    />
                  </p>
                </div>
              </div>
              <div className="Message_section">
                <div className="Message_section_head">
                  <div className="Message_section_head_logo" />
                </div>
                <div className="Message_section_content">
                  <p className="Message_section_content_text">
                    Bonjour {details.prenom}
                  </p>
                  <p className="Message_section_content_entry">
                    {parse(details.text.replace(/\n/g, "<br/>"))}
                  </p>
                </div>
                <div className="Message_section_footer">
                  <p className="Message_section_footer_text">Bien à vous,</p>
                  <hr className="Message_section_footer_separator" />
                  <p className="Message_section_footer_prenom">Perrine SAVE</p>
                  <p className="Message_section_footer_entreprise">
                    Epimeleia Massage{" "}
                  </p>
                  <a
                    href="https://epimeleia-massage.fr"
                    className="Message_section_footer_infos"
                  >
                    epimeleia-massage.fr
                  </a>
                  <a
                    href="tel:07 68 06 17 25"
                    className="Message_section_footer_infos"
                  >
                    07 68 06 17 25
                  </a>
                  <a
                    href="mailto:perrine.epimeleiamassage@gmail.com"
                    className="Message_section_footer_infos"
                  >
                    perrine.epimeleiamassage@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
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
