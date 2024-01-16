import { useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import axios from "axios";

import "../../scss/auth/SuccessLogOut.scss";

import mailError from "../../assets/LottieFiles/EmailError.json";
import LogInProgress from "../../assets/LottieFiles/LogIn.json";
import ScrollToTop from "../ResetScrollOnPage";

export default function SuccessDelete() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checktoken`,
        "CheckMePlease",
        {
          withCredentials: true,
        }
      )
      .then((res0) => {
        if (res0.data.message === "OK" && res0.data.admin === true) {
          console.info("Connexion Approuvée");
          setIsLoggedIn(true);
          setTimeout(() => {
            window.location.href = "/giftcards";
          }, 3800);
          setIsLoading(false);
        } else {
          console.info("Accès refusé");
          setTimeout(() => {
            window.location.href = "/";
          }, 3800);
          setIsLoading(false);
        }
      });
  }, []);

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <section>
        <div className="containesuccess">
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
    <div className="SuccessLogOut">
      <div className="SuccessLogOut_container">
        <ScrollToTop />
        <div className="containererror">
          <Lottie
            loop
            animationData={LogInProgress}
            play
            style={{ width: 120, height: 120 }}
          />
          <h1>Suppression de la carte cadeau</h1>
        </div>
      </div>
    </div>
  );
}
