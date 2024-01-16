import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";

import "../../scss/Giftcards/Giftcards.scss";

import Navigation from "../../components/NavigationBar";
import NavigationPhone from "../../components/NavigationBarPhone";
import ScrollToTop from "../ResetScrollOnPage";

import mailError from "../../assets/LottieFiles/EmailError.json";
import GiftcardListItem from "../../components/itemsList/GiftcardListItem";

export default function Giftcards() {
  // Stockage des informations de connexion
  // -----------------------------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Stockage des informations des Giftcards
  // -----------------------------------------------------------------------------------------------
  const [giftcardsList, setGiftcardsList] = useState([]);
  const [massagesList, setMassagesList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuantity, setSearchQuantity] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [maxCard, setMaxCard] = useState(8);

  // Verification si l'utilisateur est connécté et si son token est toujours valide
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const getGiftcardsList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/giftcard`,
          {
            withCredentials: true,
          }
        );

        setIsLoggedIn(true);
        setGiftcardsList(response.data.GiftcardsList);
        setMassagesList(response.data.MassagesList);
      } catch (err) {
        setIsLoggedIn(false);

        setTimeout(() => {
          window.location.href = "/";
        }, 3800);
      }
    };
    setIsLoading(false);
    getGiftcardsList();
  }, []);

  // Fonction de recherche
  // -----------------------------------------------------------------------------------------------

  function MassageIdName(value) {
    const massage = massagesList.filter(
      (massageData) => massageData.id === value
    );
    return massage[0].nom;
  }

  useEffect(() => {
    const filteredGiftcards = giftcardsList.filter((giftcard) => {
      return (
        massagesList.some((massage) => massage.id === giftcard.massage_id) &&
        MassageIdName(giftcard.massage_id)
          .toLowerCase()
          .match(searchValue.toLowerCase())
      );
    });

    setSearchQuantity(
      searchValue.length === 0
        ? `${giftcardsList.length} Cartes Cadeau`
        : `${filteredGiftcards.length} / ${giftcardsList.length} Cartes Cadeau`
    );
    setSearchResult(filteredGiftcards);
  }, [searchValue, giftcardsList]);

  // Fonction de tri
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const sortedGiftcards = [...giftcardsList].sort((a, b) => {
      if (sortBy === "ReferenceUp") {
        return a.id.toString().localeCompare(b.id.toString());
      }
      if (sortBy === "ReferenceDown") {
        return b.id.toString().localeCompare(a.id.toString());
      }
      if (sortBy === "dateRecent") {
        return new Date(b.date_achat) - new Date(a.date_achat);
      }
      if (sortBy === "dateAncien") {
        return new Date(a.date_achat) - new Date(b.date_achat);
      }
      return null;
    });
    setSearchResult(sortedGiftcards);
  }, [sortBy, giftcardsList]);

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
  return (
    <main className="Giftcards_page">
      <Navigation />
      <NavigationPhone />
      <ScrollToTop />
      <div className="Giftcards_container">
        <div className="Giftcards_container_filter">
          <div className="Giftcards_container_filter_box">
            <form className="Giftcards_container_filter_box_form">
              <label className="Giftcards_container_filter_box_form_icon">
                {}
              </label>
              <input
                type="text"
                id="searchClient"
                className="Giftcards_container_filter_box_form_input"
                placeholder="Rechercher"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="Giftcards_container_filter_box_sort"
            >
              <option value="">Trier par...</option>
              <option value="ReferenceUp">Réferences ↑</option>
              <option value="ReferenceDown">Réferences ↓</option>
              <option value="dateAncien">Ancien</option>
              <option value="dateRecent">Recent</option>
            </select>
          </div>
          <button
            type="button"
            className="Giftcards_container_filter_box_add"
            onClick={() => {
              window.location.href = "/giftcards/add";
            }}
          >
            <p className="Giftcards_container_filter_box_add_icon">{}</p>
            Ajouter
          </button>
        </div>
        <div className="resultQuantity">
          <p>{searchQuantity}</p>
        </div>
        {searchResult.length === 0 && searchValue !== "" ? (
          <p className="ClientNotFound">
            Aucun résultat ne correspond à votre recherche.
          </p>
        ) : null}

        <div className="Giftcards_container_list">
          {searchResult.length !== 0 ? (
            <div>
              {searchResult.slice(0, maxCard).map((giftcard) => (
                <div className="CardRow" key={giftcard.id}>
                  <GiftcardListItem
                    key={giftcard.id}
                    className="CardRow"
                    id={giftcard.id}
                    type="Massage"
                    typeValue={
                      giftcard.massage_id === null || undefined
                        ? "Non défini"
                        : MassageIdName(giftcard.massage_id)
                    }
                    montant={giftcard.montant}
                    achat={giftcard.date_achat}
                    expiration={giftcard.date_expiration}
                    utilise={giftcard.utilise}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {giftcardsList.map((giftcard) => (
                <div className="CardRow" key={giftcard.id}>
                  <GiftcardListItem
                    id={giftcard.id}
                    type="Massage"
                    typeValue={
                      giftcard.massage_id === null || undefined
                        ? "Non défini"
                        : MassageIdName(giftcard.massage_id)
                    }
                    montant={giftcard.montant}
                    achat={giftcard.date_achat}
                    expiration={giftcard.date_expiration}
                    utilise={giftcard.utilise}
                  />
                </div>
              ))}
            </div>
          )}
          {searchResult.length > maxCard ? (
            <div className="Giftcards_container_showmore">
              <button
                type="button"
                className="Giftcards_container_showmore_btn"
                onClick={() => setMaxCard((prev) => prev + 5)}
              >
                Voir plus
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
