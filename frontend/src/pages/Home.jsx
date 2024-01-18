import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";

import "../scss/home.scss";
import "../scss/pages.scss";
import LorIA from "./Chatbot";
import Navigation from "../components/NavigationBar";
import NavigationPhone from "../components/NavigationBarPhone";
import ResetScrollOnPage from "./ResetScrollOnPage";

import mailError from "../assets/LottieFiles/EmailError.json";

export default function Admin() {
  // Verification si l'utilisateur est connécté et si son token est toujours valide
  // -----------------------------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [LorIAState, setLorIAState] = useState(false);
  console.info(LorIAState);

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

  // logo de chargement et redirection si l'utilisateur n'est pas connecté
  // -----------------------------------------------------------------------------------------------
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

  if (LorIAState) {
    return (
      <main id="MainContent">
        <Navigation onClickFunction={() => setLorIAState(!LorIAState)} />
        <NavigationPhone />
        <ResetScrollOnPage />
        <LorIA />;
      </main>
    );
  }

  return (
    <main id="MainContent">
      <Navigation />
      <NavigationPhone />
      <ResetScrollOnPage />
      <div className="admin_container">
        {/* <Header /> */}
        <div className="admin_container_infos">
          <div className="admin_container_infos_banner">
            <span />
            <div className="banner_box">
              <p className="banner_box_new">NEW</p>
              <p className="banner_box_name">[Metal Detox]</p>
              <p className="banner_box_title">
                Acts against hair breakage and preserves color.
              </p>
              <button type="button" className="banner_box_button">
                Shop now
              </button>
            </div>
          </div>
        </div>
        <div className="admin_container_data">
          <div className="admin_container_data_recommanded">
            <h2 className="categoryTitle">Last orders</h2>
            <div className="list_of_product" />
          </div>
          <div className="admin_container_data_recommanded">
            <h2 className="categoryTitle">Recommanded products</h2>
            <div className="list_of_product" />
          </div>
        </div>
      </div>
      <LorIA />
    </main>
  );
}
