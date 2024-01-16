import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Markdown from "react-markdown";
import Lottie from "react-lottie-player";

import "../../scss/Giftcards/addgiftcard.scss";

import Navigation from "../../components/NavigationBar";
import NavigationPhone from "../../components/NavigationBarPhone";
import AlertBox from "../../components/alertBox/alertBox";
import ScrollToTop from "../ResetScrollOnPage";

import mailError from "../../assets/LottieFiles/EmailError.json";
import Validate from "../../assets/LottieFiles/Done.json";

export default function AddGiftcard() {
  // Stockage des données de connexion
  // ------------------------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [massageList, setMassageList] = useState([]);
  const [typePaiement, setTypePaiement] = useState([]);

  // const [forfaitList, setForfaitList] = useState([]);

  const [ifGiftCardCreated, setIfGiftCardCreated] = useState(false);
  const [newGiftCardId, setNewGiftCardId] = useState("");

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

  // Vérifier si l'utilisateur est connecté et récupéré la donnée
  // ------------------------------------------------------------------------------------------
  useEffect(() => {
    const AskData = async () => {
      try {
        const infoResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/giftcard/info`,
          {
            withCredentials: true,
          }
        );
        setMassageList(infoResponse.data.massages);
        setTypePaiement(infoResponse.data.typePaiement);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setTimeout(() => {
          window.location.replace("/");
        }, 3800);
      }
      setIsLoading(false);
    };

    AskData();
  }, []);

  // Stockage des données du formulaire
  // ------------------------------------------------------------------------------------------
  const [receveurInfos, setReceveurInfos] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    codePostal: "",
    ville: "",
  });
  const [acheteurInfos, setAcheteurInfos] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    codePostal: "",
    ville: "",
  });
  const [giftcardInfos, setGiftcardInfos] = useState({
    type: "massage",
    massageId: null,
    forfaitId: null,
    montant: null,
    paiementType: "",
  });

  // Formater l'ID' de sortie de la carte cadeau
  // ------------------------------------------------------------------------------------------
  function RefId(value) {
    let ref;
    let prefix;
    if (giftcardInfos.forfaitId !== null) {
      prefix = "CDF";
    } else {
      prefix = "CDM";
    }
    if (value < 100) {
      ref = `${prefix}-00${value}`;
    } else if (value < 10) {
      ref = `${prefix}-0${value}`;
    } else {
      ref = `${prefix}-${value}`;
    }
    return ref;
  }

  // Stockage des données du formulaire
  // ------------------------------------------------------------------------------------------
  function handleReceveurChange(event) {
    setReceveurInfos({
      ...receveurInfos,
      [event.target.name]: event.target.value,
    });
  }

  function handleAcheteurChange(event) {
    setAcheteurInfos({
      ...acheteurInfos,
      [event.target.name]: event.target.value,
    });
  }

  function handleGiftcardChange(event) {
    setGiftcardInfos({
      ...giftcardInfos,
      [event.target.name]: event.target.value,
    });
  }

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

  // Envoie des données du formulaire
  // ------------------------------------------------------------------------------------------
  function handleSubmit(event) {
    event.preventDefault();

    const receveur = {
      nom: escapeHtml(receveurInfos.nom),
      prenom: escapeHtml(receveurInfos.prenom),
      email: escapeHtml(receveurInfos.email),
      telephone: escapeHtml(receveurInfos.telephone),
      adresse: escapeHtml(receveurInfos.adresse),
      codePostal: escapeHtml(receveurInfos.codePostal),
      ville: escapeHtml(receveurInfos.ville),
    };
    const acheteur = {
      nom: escapeHtml(acheteurInfos.nom),
      prenom: escapeHtml(acheteurInfos.prenom),
      email: escapeHtml(acheteurInfos.email),
      telephone: escapeHtml(acheteurInfos.telephone),
      adresse: escapeHtml(acheteurInfos.adresse),
      codePostal: escapeHtml(acheteurInfos.codePostal),
      ville: escapeHtml(acheteurInfos.ville),
    };

    const giftcard = {
      massageId: giftcardInfos.massageId,
      forfaitId: giftcardInfos.forfaitId,
      montant: escapeHtml(giftcardInfos.montant),
      paiementType: giftcardInfos.paiementType,
    };
    const giftcardInfosToSend = {
      receveur,
      acheteur,
      giftcard,
    };

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/giftcard/add`,
        giftcardInfosToSend,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.message === "OK") {
          setIfGiftCardCreated(true);
          setNewGiftCardId(res.data.newGiftcardID);
          alertBox({
            type: "success",
            entete: "Carte Cadeau Ajoutée",
            message: "La carte cadeau a bien été ajoutée.",
          });
        } else {
          alertBox({
            type: "error",
            entete: "Erreur",
            message: "Une erreur est survenue, veuillez réessayer.",
          });
        }
      })

      .catch((err) => {
        alertBox({
          type: "error",
          entete: "Erreur",
          message: "Une erreur est survenue, veuillez réessayer.",
        });
        console.info(err);
      });
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
    );
  }

  if (ifGiftCardCreated) {
    return (
      <main>
        <Navigation />
        <NavigationPhone />
        <div className="SuccessPage">
          <Lottie
            loop
            animationData={Validate}
            play
            style={{ width: 120, height: 120 }}
          />
          <h1>{RefId(newGiftCardId)}</h1>
          <Markdown className="SuccessPage_message">
            `Votre carte cadeau a bien été créée.`
          </Markdown>
          <Link to="/giftcards" className="SuccessPage_button">
            Voir les cartes cadeaux
          </Link>
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
    ); //
  }

  return (
    <main>
      <Navigation />
      <NavigationPhone />
      <ScrollToTop />
      <div className="Add_container">
        <div className="Add_grid_content">
          <div className="Add_grid_content_explain">
            <h1>Ajouter une nouvelle Carte Cadeau</h1>
            <Markdown className="paragraphe">
              {`Remplis le formulaire ci contre pour ajouter une nouvelle Carte Cadeau.
              Les champs marqués d'une étoile sont obligatoires.`}
            </Markdown>
            <Markdown className="paragraphe">
              {`Entrez les informations du receveur et de l'acheteur. Si ils existe déjà dans la liste des clients, la carte cadeau leur sera attribuée. Sinon, un nouveau clients sera créé.`}
            </Markdown>
            <br />
            <Markdown className="paragraphe">
              `Choisissez ensuite le type de carte cadeau et remplissez les
              champs associés. La date d'achat et la date d'expiration sont
              définies automatiquement.`
            </Markdown>
          </div>
          <form className="Add_grid_content_form">
            {/* Receveur */}

            <div className="Add_grid_content_form_box">
              <h2 className="CategoryTitle">Receveur</h2>
              {/* Nom */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Nom *</p>
                <input
                  className="form_placeholder_input"
                  name="nom"
                  id="receveur_nom"
                  value={receveurInfos.nom || ""}
                  onChange={handleReceveurChange}
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
                  id="receveur_prenom"
                  value={receveurInfos.prenom || ""}
                  onChange={handleReceveurChange}
                  type="text"
                  placeholder="John"
                  pattern="[A-Za-z '-]{2,50}"
                  required
                />
              </div>
              {/* Téléphone */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Téléphone</p>
                <input
                  className="form_placeholder_input"
                  name="telephone"
                  id="receveur_telephone"
                  value={receveurInfos.telephone || ""}
                  onChange={handleReceveurChange}
                  type="phone"
                  placeholder="0506070809"
                  pattern="[+]?[0-9\s-]+"
                  required
                />
              </div>
              {/* Email */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Email</p>
                <input
                  className="form_placeholder_input"
                  name="email"
                  id="receveur_email"
                  value={receveurInfos.email || ""}
                  onChange={handleReceveurChange}
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
                  id="receveur_adresse"
                  value={receveurInfos.adresse || ""}
                  onChange={handleReceveurChange}
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
                  id="receveur_code_postal"
                  value={receveurInfos.codePostal || ""}
                  onChange={handleReceveurChange}
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
                  id="receveur_ville"
                  value={receveurInfos.ville || ""}
                  onChange={handleReceveurChange}
                  type="text"
                  placeholder="Mortagne sur Sèvre"
                  pattern="[A-Za-z0-9\s,.-À-ÿ]+"
                />
              </div>
            </div>
            {/* Acheteur */}

            <div className="Add_grid_content_form_box">
              <h3 className="CategoryTitle">Acheteur</h3>
              {/* Nom */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Nom *</p>
                <input
                  className="form_placeholder_input"
                  name="nom"
                  id="acheteur_nom"
                  value={acheteurInfos.nom || ""}
                  onChange={handleAcheteurChange}
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
                  id="acheteur_prenom"
                  value={acheteurInfos.prenom || ""}
                  onChange={handleAcheteurChange}
                  type="text"
                  placeholder="John"
                  pattern="[A-Za-z '-]{2,50}"
                  required
                />
              </div>
              {/* Téléphone */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Téléphone</p>
                <input
                  className="form_placeholder_input"
                  name="telephone"
                  id="acheteur_telephone"
                  value={acheteurInfos.telephone || ""}
                  onChange={handleAcheteurChange}
                  type="phone"
                  placeholder="0506070809"
                  pattern="[+]?[0-9\s-]+"
                  required
                />
              </div>
              {/* Email */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Email</p>
                <input
                  className="form_placeholder_input"
                  name="email"
                  id="acheteur_email"
                  value={acheteurInfos.email || ""}
                  onChange={handleAcheteurChange}
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
                  id="acheteur_adresse"
                  value={acheteurInfos.adresse || ""}
                  onChange={handleAcheteurChange}
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
                  id="acheteur_code_postal"
                  value={acheteurInfos.codePostal || ""}
                  onChange={handleAcheteurChange}
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
                  id="acheteur_ville"
                  value={receveurInfos.ville || ""}
                  onChange={handleReceveurChange}
                  type="text"
                  placeholder="Mortagne sur Sèvre"
                  pattern="[A-Za-z0-9\s,.-À-ÿ]+"
                />
              </div>
            </div>
            {/* Giftcard */}

            <div className="Add_grid_content_form_box">
              <h4 className="CategoryTitle">Carte Cadeau</h4>
              {/* Type de carte */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Type</p>
                <select
                  className="form_placeholder_input"
                  name="type"
                  id="type"
                  value={giftcardInfos.type || ""}
                  onChange={handleGiftcardChange}
                >
                  <option value="massage">Massage</option>
                  <option value="forfait">[Soon] Forfait</option>
                </select>
              </div>
              {/* Massage */}
              {giftcardInfos.type === "massage" ? (
                <div className="form_placeholder form_final">
                  <p className="form_placeholder_title">Massage</p>
                  <select
                    className="form_placeholder_input"
                    name="massageId"
                    id="massageId"
                    value={giftcardInfos.massageId || ""}
                    onChange={handleGiftcardChange}
                  >
                    <option value="">--</option>
                    {massageList.map((massage) => (
                      <option key={massage.id} value={massage.id}>
                        {massage.nom}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form_placeholder form_final">
                  <p className="form_placeholder_title">Forfait</p>
                  <select
                    className="form_placeholder_input"
                    name="forfaitId"
                    id="forfaitId"
                    value={giftcardInfos.forfaitId || ""}
                    onChange={handleGiftcardChange}
                  >
                    <option value="">--</option>
                    {/* {forfaitList.map((forfait) => (
                      <option key={forfait.id} value={forfait.id}>
                        {forfait.nom}
                      </option>
                    ))} */}
                  </select>
                </div>
              )}
            </div>
            {/* Paiement */}

            <div className="Add_grid_content_form_box">
              <h5 className="CategoryTitle">Paiement</h5>
              {/* Montant */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Montant</p>
                <input
                  className="form_placeholder_input"
                  name="montant"
                  id="montant"
                  value={giftcardInfos.montant || ""}
                  onChange={handleGiftcardChange}
                  type="number"
                  placeholder="65"
                  pattern="[0-9\s-]{1,6}"
                />
                <p>€</p>
              </div>
              {/* Paiement */}
              <div className="form_placeholder form_final">
                <p className="form_placeholder_title">Paiement</p>
                <select
                  className="form_placeholder_input"
                  name="paiementType"
                  id="paiementType"
                  value={giftcardInfos.paiementType || ""}
                  onChange={handleGiftcardChange}
                >
                  <option value="">--</option>
                  {typePaiement.map((paiement) => (
                    <option key={paiement.id} value={paiement.id}>
                      {paiement.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
          <div className="Add_grid_content_form_buttons">
            <button
              onClick={handleSubmit}
              disabled={
                !receveurInfos.nom ||
                !receveurInfos.prenom ||
                !acheteurInfos.nom ||
                !acheteurInfos.prenom ||
                !(giftcardInfos.massageId || giftcardInfos.forfaitId) ||
                !giftcardInfos.montant ||
                !giftcardInfos.paiementType
              }
              className="Add_grid_content_form_buttons_send"
              type="button"
            >
              Créer la carte cadeau
            </button>
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
