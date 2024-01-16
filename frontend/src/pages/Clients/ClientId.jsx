import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import Lottie from "react-lottie-player";

import "../../scss/clients/clientID.scss";

import Navigation from "../../components/NavigationBar";
import NavigationPhone from "../../components/NavigationBarPhone";
import AlertBox from "../../components/alertBox/alertBox";
import ScrollToTop from "../ResetScrollOnPage";
import GiftCardList from "../../components/itemsList/GiftcardListItem";

import mailError from "../../assets/LottieFiles/EmailError.json";

export default function ClientId() {
  // Récupération de l'id du client
  // -----------------------------------------------------------------------------------------------
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Stockage des infos client
  // -----------------------------------------------------------------------------------------------
  const [clientItem, setClientItem] = useState([]);
  const [clientGiftcardItem, setClientGiftCardItem] = useState([]);
  // const [clientForfaitItem] = useState([]);
  const [massageList, setMassageList] = useState([]);
  const [detailsChange, setDetailsChange] = useState(false);

  // Alerte Box Configurations
  // -----------------------------------------------------------------------------------------------
  const [displayMode, setDisplayMode] = useState("none");
  const [AlertType, setAlertType] = useState("");
  const [AlerteEntete, setAlerteEntete] = useState("");
  const [AlertMessageSuccess, setAlertMessageSuccess] = useState("");
  const [AlertLink, setAlertLink] = useState("");

  // Valeur de rendu composant
  // -----------------------------------------------------------------------------------------------
  const [maxCard, setMaxCard] = useState(1);

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
  // -----------------------------------------------------------------------------------------------
  const isNomValid = (value) => {
    const nomPattern = /^[A-Za-z '-]{2,50}$/;
    return nomPattern.test(value);
  };
  const isPrenomValid = (value) => {
    const prenomPattern = /^[A-Za-z '-]{2,50}$/;
    return prenomPattern.test(value);
  };
  const isEmailValid = (value) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,4}$/;
    return emailPattern.test(value);
  };
  const isTelephoneValid = (value) => {
    const telephonePattern = /^[+]?[0-9\s-]+/;
    return telephonePattern.test(value);
  };

  const isPostalCodeValid = (value) => {
    const postalCodePattern = /^\d{1,5}$/;
    return postalCodePattern.test(value);
  };

  // Gestion des changements dans les champs
  // -----------------------------------------------------------------------------------------------
  const handleDetailsChange = (event) => {
    const { name, value } = event.target;
    setClientItem((prevDetails) => {
      setDetailsChange(true);
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

  // Gestion de la soumission du formulaire
  // -----------------------------------------------------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!isNomValid(clientItem.nom)) {
        alertBox({
          type: "warning",
          entete: "🤭 Oups !",
          message: "Le nom est invalide !",
        });
      } else {
        setAlertType("");

        if (!isPrenomValid(clientItem.prenom)) {
          alertBox({
            type: "warning",
            entete: "🤭 Oups !",
            message: "Le prenom est invalide !",
          });
        } else {
          setAlertType("");

          if (!isTelephoneValid(clientItem.telephone)) {
            alertBox({
              type: "warning",
              entete: "🤭 Oups !",
              message: "Le numéro de téléphone est invalide !",
            });
          } else {
            setAlertType("");

            if (clientItem.telephone.includes("+33")) {
              clientItem.telephone = clientItem.telephone.replace("+33", "0");
              if (clientItem.telephone.startsWith("00")) {
                clientItem.telephone = clientItem.telephone.replace("00", "0");
              }
            }
            if (!isEmailValid(clientItem.email)) {
              alertBox({
                type: "warning",
                entete: "🤭 Oups !",
                message: "L'email est invalide !",
              });
            } else {
              setAlertType("");
              if (
                clientItem.code_postal.length !== 0 &&
                !isPostalCodeValid(clientItem.code_postal)
              ) {
                alertBox({
                  type: "warning",
                  entete: "🤭 Oups !",
                  message: "Le code postal est invalide !",
                });
              } else {
                const response = await axios.post(
                  `${import.meta.env.VITE_BACKEND_URL}/api/client/update/${id}`,
                  {
                    nom: escapeHtml(clientItem.nom),
                    prenom: escapeHtml(clientItem.prenom),
                    telephone: escapeHtml(clientItem.telephone),
                    email: escapeHtml(clientItem.email),
                    adresse: escapeHtml(clientItem.adresse),
                    codePostal: escapeHtml(clientItem.code_postal),
                    ville: escapeHtml(clientItem.ville),
                    notes: escapeHtml(clientItem.notes),
                  },
                  {
                    withCredentials: true,
                  }
                );

                alertBox({
                  type: "success",
                  entete: "✅ Mis a jour !",
                  message: "Le client a été mis a jour avec succès !",
                  link: response.data.id,
                });
                setDetailsChange(false);
              }
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

  // Verification de la connexion et Récupération des données si connecté
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const getClientsList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/client/${id}`,
          {
            withCredentials: true,
          }
        );
        setClientItem(response.data.client);
        setClientGiftCardItem(response.data.giftcards);
        setMassageList(response.data.massages);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setTimeout(() => {
          window.location.href = "/";
        }, 3800);
      }
    };
    getClientsList();
    setIsLoading(false);
  }, []);

  // Fonction de récupération du nom du massage ou du forfait
  // -----------------------------------------------------------------------------------------------
  function MassageIdName(value) {
    const massage = massageList.filter(
      (massageData) => massageData.id === value
    );
    return massage[0].nom;
  }

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
      <div className="Client_container">
        <Navigation />
        <NavigationPhone />
        <ScrollToTop />

        {/* Information Client */}
        <div className="Client_grid_content">
          <div className="Client_grid_content_informations">
            <div className="Client_grid_content_informations_explain">
              <h1>Modifier un client</h1>
              <p className="paragraphe">
                Modifie les informations du client directement dans les champs
                ci-contre.
              </p>
              <Markdown className="paragraphe">
                {`**Si le client n'est pas à jour, le bouton deviendra actif.**`}
              </Markdown>
            </div>
            <div className="Client_grid_content_informations_actions">
              <h1>Actions Rapides</h1>
              <button
                type="button"
                className="Client_grid_content_informations_actions_btn mailbtn"
                onClick={() => {
                  window.location.href = `/clients/${id}/email`;
                }}
              >
                Envoyer un email
              </button>
            </div>
          </div>

          <form className="Client_grid_content_form">
            <div className="Client_grid_content_form_box">
              <h2 className="CategoryTitle">Informations Client</h2>
              {/* Nom */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Nom *</p>
                <input
                  className="form_placeholder_input"
                  name="nom"
                  id="nom"
                  value={clientItem.nom || ""}
                  onChange={handleDetailsChange}
                  type="text"
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
                  value={clientItem.prenom || ""}
                  onChange={handleDetailsChange}
                  type="text"
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
                  value={clientItem.telephone || ""}
                  onChange={handleDetailsChange}
                  type="phone"
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
                  value={clientItem.email || ""}
                  onChange={handleDetailsChange}
                  type="email"
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
                  value={clientItem.adresse || ""}
                  onChange={handleDetailsChange}
                  type="text"
                />
              </div>
              {/* Code Postal */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Code Postal</p>
                <input
                  className="form_placeholder_input"
                  name="code_postal"
                  id="code_postal"
                  value={clientItem.code_postal || ""}
                  onChange={handleDetailsChange}
                  type="text"
                />
              </div>
              {/* Ville */}
              <div className="form_placeholder form_final">
                <p className="form_placeholder_title">Ville</p>
                <input
                  className="form_placeholder_input"
                  name="ville"
                  id="ville"
                  value={clientItem.ville || ""}
                  onChange={handleDetailsChange}
                  type="text"
                />
              </div>
            </div>
            <div className="Client_grid_content_notes_box">
              <h3 className="CategoryTitle">Notes</h3>
              {/* Notes */}
              <div className="form_placeholder">
                <textarea
                  className="form_placeholder_textarea "
                  name="notes"
                  id="notes"
                  value={clientItem.notes || ""}
                  onChange={handleDetailsChange}
                  type="text"
                />
                <div className="form_buttons">
                  <button
                    type="button"
                    disabled={detailsChange === false}
                    onClick={handleSubmit}
                    className="saveChanges"
                  >
                    {detailsChange === false ? "Client à jour" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Cartes Cadeau */}
        <div className="Client_item_list">
          <div className="Client_item_list_header">
            <p className="CategoryTitle">Cartes Cadeaux</p>
            <div className="resultQuantity">
              <p className="resultQuantity_value">{`${clientGiftcardItem.length} résultats`}</p>
            </div>
          </div>

          {clientGiftcardItem.length === 0 ? (
            <p className="GiftCardNotFound">
              Il n'y a pas de cartes cadeaux pour ce client.
            </p>
          ) : (
            <div className="Client_item_list_box">
              {clientGiftcardItem.slice(0, maxCard).map((client) => (
                <div className="CardRow" key={client.id}>
                  <GiftCardList
                    className="CardRow"
                    id={client.id}
                    type="Massage"
                    typeValue={
                      client.massage_id === null || undefined
                        ? "Non défini"
                        : MassageIdName(client.massage_id)
                    }
                    montant={client.montant}
                    achat={client.date_achat}
                    expiration={client.date_expiration}
                    utilise={client.utilise}
                  />
                </div>
              ))}
              {clientGiftcardItem.length > maxCard ? (
                <div className="Client_item_list_box_showmore">
                  <button
                    type="button"
                    className="Client_item_list_box_showmore_btn"
                    onClick={() => setMaxCard((prev) => prev + 5)}
                  >
                    Voir plus
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Forfaits 
        <div className="Client_item_list">
          <div className="Client_item_list_header">
            <p className="CategoryTitle">Forfaits</p>
            <div className="resultQuantity">
              <p className="resultQuantity_value">{`${clientForfaitItem.length} résultats`}</p>
            </div>
          </div>

          {clientForfaitItem.length === 0 ? (
            <p className="GiftCardNotFound">
              Il n'y a pas de cartes cadeaux pour ce client.
            </p>
          ) : (
            <div className="Client_item_list_box">
              {clientForfaitItem.slice(0, maxCard).map((client) => (
                <div className="CardRow" key={client.id}>
                  <GiftCardList
                    className="CardRow"
                    id={client.id}
                    type="Massage"
                    typeValue={
                      client.massage_id === null || undefined
                        ? "Non défini"
                        : MassageIdName(client.massage_id)
                    }
                    nbSeance={client.nb_seance}
                    nbSeanceRestante={client.nb_seance_restante}
                    achat={client.date_achat}
                    expiration={client.date_expiration}
                  />
                </div>
              ))}
              {clientGiftcardItem.length > maxCard ? (
                <div className="Client_item_list_box_showmore">
                  <button
                    type="button"
                    className="Client_item_list_box_showmore_btn"
                    onClick={() => setMaxCard((prev) => prev + 5)}
                  >
                    Voir plus
                  </button>
                </div>
              ) : null}
            </div> 
          )}
        </div> */}
        <div className="deleteUser_container">
          <button
            type="button"
            className="deleteUser_container_btn"
            onClick={() => {
              window.location.href = `/clients/${id}/delete`;
            }}
          >
            Supprimer ce client
          </button>
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
