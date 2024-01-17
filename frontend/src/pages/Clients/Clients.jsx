import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";

import "../../scss/clients/clients.scss";

import Navigation from "../../components/NavigationBar";
import NavigationPhone from "../../components/NavigationBarPhone";
import ScrollToTop from "../ResetScrollOnPage";

import mailError from "../../assets/LottieFiles/EmailError.json";
import ClientListItem from "../../components/itemsList/ClientListItem";

export default function Clients() {
  // Stockage des informations de connexion
  // -----------------------------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Stockage des informations des clients
  // -----------------------------------------------------------------------------------------------
  const [clientsList, setClientsList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuantity, setSearchQuantity] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Verification si l'utilisateur est connécté et si son token est toujours valide
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const getClientsList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/client`,
          {
            withCredentials: true,
          }
        );
        setClientsList(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(true);
        /* setTimeout(() => {
          window.location.href = "/";
        }, 3800); */
      }
    };
    getClientsList();
    setIsLoading(false);
  }, []);

  // Fonction de recherche
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const filteredClients = clientsList.filter(
      (client) =>
        client.nom.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.prenom.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.telephone.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchQuantity(
      searchValue.length === 0
        ? `${clientsList.length} clients`
        : `${filteredClients.length} / ${clientsList.length} clients`
    );
    setSearchResult(filteredClients);
  }, [searchValue, clientsList]);

  // Fonction de tri
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const sortedClients = [...clientsList].sort((a, b) => {
      if (sortBy === "AtoZ") {
        return a.prenom.localeCompare(b.prenom);
      }
      if (sortBy === "ZtoA") {
        return b.prenom.localeCompare(a.prenom);
      }
      if (sortBy === "dateRecent") {
        return new Date(b.creation_date) - new Date(a.creation_date);
      }
      if (sortBy === "dateAncien") {
        return new Date(a.creation_date) - new Date(b.creation_date);
      }
      return null;
    });
    setSearchResult(sortedClients);
  }, [sortBy, clientsList]);

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
    <main className="clients_page">
      <Navigation />
      <NavigationPhone />
      <ScrollToTop />
      <div className="clients_container">
        <div className="clients_container_filter">
          <div className="clients_container_filter_box">
            <form className="clients_container_filter_box_form">
              <label className="clients_container_filter_box_form_icon">
                {}
              </label>
              <input
                type="text"
                id="searchClient"
                className="clients_container_filter_box_form_input"
                placeholder="Rechercher"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="clients_container_filter_box_sort"
            >
              <option value="">Trier par...</option>
              <option value="AtoZ">A à Z</option>
              <option value="ZtoA">Z à A</option>
              <option value="dateAncien">Ancien</option>
              <option value="dateRecent">Recent</option>
            </select>
          </div>
          <button
            type="button"
            className="clients_container_filter_box_add"
            onClick={() => {
              window.location.href = "/clients/add";
            }}
          >
            <p className="clients_container_filter_box_add_icon">{}</p>
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

        <div className="clients_container_list">
          {searchResult.length !== 0 ? (
            <div>
              {searchResult.map((client) => (
                <ClientListItem
                  className="clients_container_list_item"
                  key={client.id}
                  id={client.id}
                  nom={client.nom}
                  prenom={client.prenom}
                  email={client.email}
                  telephone={client.telephone}
                />
              ))}
            </div>
          ) : (
            <div>
              {clientsList.map((client) => (
                <ClientListItem
                  className="clients_container_list_item"
                  key={client.id}
                  id={client.id}
                  nom={client.nom}
                  prenom={client.prenom}
                  email={client.email}
                  telephone={client.telephone}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
