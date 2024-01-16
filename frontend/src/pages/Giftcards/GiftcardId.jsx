import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import axios from "axios";
import Markdown from "react-markdown";
import Lottie from "react-lottie-player";

import "../../scss/Giftcards/giftcardId.scss";

import Navigation from "../../components/NavigationBar";
import NavigationPhone from "../../components/NavigationBarPhone";
import AlertBox from "../../components/alertBox/alertBox";
import ScrollToTop from "../ResetScrollOnPage";

import mailError from "../../assets/LottieFiles/EmailError.json";
import Validate from "../../assets/LottieFiles/Done.json";

export default function GiftcardID() {
  const { id } = useParams();
  // Stockage des données de connexion
  // ------------------------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [massageList, setMassageList] = useState([]);
  const [typePaiement, setTypePaiement] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [searchReceveur, setSearchReceveur] = useState("");
  const [searchAcheteur, setSearchAcheteur] = useState("");

  // const [forfaitList, setForfaitList] = useState([]);

  const [ifGiftCardUpdated, setIfGiftCardUpdated] = useState(false);
  const [newGiftCardId, setNewGiftCardId] = useState("");

  // Stockage des données du formulaire
  // ------------------------------------------------------------------------------------------
  const [giftcardInfos, setGiftcardInfos] = useState({});
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
          `${import.meta.env.VITE_BACKEND_URL}/api/giftcard/${id}`,
          {
            withCredentials: true,
          }
        );
        await setMassageList(infoResponse.data.massages);
        await setTypePaiement(infoResponse.data.typePaiement);
        await setClientsList(infoResponse.data.clients);
        await setGiftcardInfos(infoResponse.data.giftcard[0]);
        await setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setTimeout(() => {
          window.location.replace("/");
        }, 3800);
      }
      await setIsLoading(false);
    };

    AskData();
  }, []);
  // Formater l'ID' de sortie de la carte cadeau
  // ------------------------------------------------------------------------------------------
  function RefId(value) {
    let ref;
    let prefix;
    if (giftcardInfos.forfait_id !== null) {
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

  const handleSearchReceveurChange = (e) => {
    setSearchReceveur(e.target.value);
  };

  const handleSearchAcheteurChange = (e) => {
    setSearchAcheteur(e.target.value);
  };

  const filteredReceveur = clientsList.filter((client) => {
    const fullName = `${client.nom} ${client.prenom}`;
    return fullName.toLowerCase().includes(searchReceveur.toLowerCase());
  });

  const filteredAcheteur = clientsList.filter((client) => {
    const fullName = `${client.nom} ${client.prenom}`;
    return fullName.toLowerCase().includes(searchAcheteur.toLowerCase());
  });

  // Stockage des données du formulaire
  // ------------------------------------------------------------------------------------------
  function handleGiftcardChange(event) {
    setGiftcardInfos({
      ...giftcardInfos,
      [event.target.name]: event.target.value,
    });
    setDataChanged(true);
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

    const giftcard = {
      massage_id: giftcardInfos.massage_id,
      client_id: giftcardInfos.client_id,
      forfait_id: giftcardInfos.forfait_id,
      acheteur_id: giftcardInfos.acheteur_id,
      montant: escapeHtml(giftcardInfos.montant),
      paiementType: giftcardInfos.paiementType,
      utilise: giftcardInfos.utilise,
    };

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/giftcard/update/${id}`,
        giftcard,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setIfGiftCardUpdated(false);
        setDataChanged(false);
        setNewGiftCardId(res.data.newGiftcardID);
        alertBox({
          type: "success",
          entete: "Carte Cadeau Mise à jour",
          message: "La carte cadeau a bien été mise à jour.",
        });
      })

      .catch((err) => {
        alertBox({
          type: "error",
          entete: "Erreur",
          message: "Une erreur est survenue, veuillez réessayer.",
          link: err,
        });
      });
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois sont indexés à partir de 0 en JavaScript
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
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

  if (ifGiftCardUpdated) {
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
            `Votre carte cadeau a bien été mise à jour.`
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
      <div className="GiftcardUpdate_container">
        <div className="GiftcardUpdate_grid_content">
          {/* Explain */}
          <div className="GiftcardUpdate_grid_content_explain">
            <h1>Modifier une Carte Cadeau</h1>
            <Markdown className="paragraphe">
              `Si vous souhaitez modifier une carte cadeau, vous pouvez le faire
              ici.`
            </Markdown>
            <Markdown className="paragraphe">
              {`Modifiez le destinataire ou l'acheteur en sélectionnant dans la liste des clients. Vous pouvez également effectuer une recherche pour réduire la liste. Si vous devez ajouter un nouveau client, vous devrez le faire avant de modifier la carte cadeau. `}
            </Markdown>
            <br />
            <Markdown className="paragraphe">
              `Pensez à bien vérifier les informations avant de valider.`
            </Markdown>
          </div>
          <form className="GiftcardUpdate_grid_content_form">
            {/* Receveur */}
            <div className="GiftcardUpdate_grid_content_form_box">
              <h4 className="CategoryTitle">Receveur</h4>
              <div className="form_placeholder">
                <p className="form_placeholder_title">Recherche</p>
                <input
                  className="form_placeholder_input"
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchReceveur || ""}
                  onChange={handleSearchReceveurChange}
                />
              </div>
              <div className="form_placeholder form_final">
                <p className="form_placeholder_title">Client</p>

                <select
                  className="form_placeholder_input"
                  name="client_id"
                  id="client_id"
                  value={giftcardInfos.client_id || ""}
                  onChange={handleGiftcardChange}
                >
                  <option value={null}>--</option>

                  {filteredReceveur.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nom} {client.prenom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Acheteur */}
            <div className="GiftcardUpdate_grid_content_form_box">
              <h4 className="CategoryTitle">Acheteur</h4>
              <div className="form_placeholder">
                <p className="form_placeholder_title">Recherche</p>
                <input
                  className="form_placeholder_input"
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchAcheteur || ""}
                  onChange={handleSearchAcheteurChange}
                />
              </div>
              <div className="form_placeholder form_final">
                <p className="form_placeholder_title">Client</p>

                <select
                  className="form_placeholder_input"
                  name="acheteur_id"
                  id="acheteur_id"
                  value={giftcardInfos.acheteur_id || ""}
                  onChange={handleGiftcardChange}
                >
                  <option value={null}>--</option>

                  {filteredAcheteur.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nom} {client.prenom}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Giftcard */}
            <div className="GiftcardUpdate_grid_content_form_box ">
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
                  <option value="Massage">Massage</option>
                  <option value="Forfait">[Soon] Forfait</option>
                </select>
              </div>
              {/* Massage */}
              {giftcardInfos.massage_id !== null ? (
                <div className="form_placeholder form_final">
                  <p className="form_placeholder_title">Massage</p>
                  <select
                    className="form_placeholder_input"
                    name="massage_id"
                    id="massage_id"
                    value={giftcardInfos.massage_id || ""}
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
                    value={giftcardInfos.forfait_id || ""}
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
            <div className="GiftcardUpdate_grid_content_form_box">
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
            {/* Infos */}
            <div className="GiftcardUpdate_grid_content_form_box">
              <h5 className="CategoryTitle">Information Supplémentaires</h5>
              {/* Date Achat */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Référence</p>
                <div className="form_placeholder_input">
                  {RefId(giftcardInfos.id)}
                </div>
              </div>
              {/* Date Achat */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Achat</p>
                <div className="form_placeholder_input">
                  {formatDate(giftcardInfos.date_achat)}
                </div>
              </div>
              {/* Date Expiration */}
              <div className="form_placeholder">
                <p className="form_placeholder_title">Expiration</p>
                <div className="form_placeholder_input">
                  {formatDate(giftcardInfos.date_expiration) <
                  formatDate(Date.now())
                    ? "Expiré"
                    : formatDate(giftcardInfos.date_expiration)}
                </div>
              </div>
              {/* Etat */}
              <div className="form_placeholder form_final">
                <p className="form_placeholder_title">Etat</p>
                <select
                  className="form_placeholder_input"
                  name="utilise"
                  id="utilise"
                  value={giftcardInfos.utilise}
                  onChange={handleGiftcardChange}
                >
                  <option value={0}>Non Utilisé</option>
                  <option value={1}>Utilisé</option>
                </select>
              </div>
            </div>
          </form>
          <div className="GiftcardUpdate_grid_content_form_buttons">
            <button
              onClick={() => {
                window.location.href = `/giftcards/${id}/delete`;
              }}
              className="GiftcardUpdate_grid_content_form_buttons_delete"
              type="button"
            >
              Supprimer la carte cadeau
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                !giftcardInfos.client_id ||
                !giftcardInfos.acheteur_id ||
                !(giftcardInfos.massage_id || giftcardInfos.forfait_id) ||
                !giftcardInfos.montant ||
                !giftcardInfos.paiementType ||
                !dataChanged
              }
              className="GiftcardUpdate_grid_content_form_buttons_send"
              type="button"
            >
              {dataChanged
                ? "Enregistrer les modifications"
                : "Carte Cadeau à jour"}
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
