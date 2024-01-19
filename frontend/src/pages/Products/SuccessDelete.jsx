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
            window.location.href = "/clients";
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
        <div className="containererror">
          <Lottie
            loop
            animationData={mailError}
            play
            style={{ width: 120, height: 120 }}
          />
          <h1>Access Denied</h1>
          <p className="message">
            {`
          You are not authorized to access this page.`}
            <br /> `You will be redirected to the login page.`
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
          <h1>Suppression du client</h1>
        </div>
      </div>
    </div>
  );
}
