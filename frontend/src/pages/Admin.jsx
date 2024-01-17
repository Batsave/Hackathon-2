import React, { useState, useEffect } from "react";
import { BarChart, Bar, Rectangle, XAxis, ResponsiveContainer } from "recharts";
import axios from "axios";
import Lottie from "react-lottie-player";

import "../scss/admin.scss";
import "../scss/pages.scss";

import Navigation from "../components/NavigationBar";
import NavigationPhone from "../components/NavigationBarPhone";
import ResetScrollOnPage from "./ResetScrollOnPage";

import mailError from "../assets/LottieFiles/EmailError.json";

export default function Admin() {
  // Verification si l'utilisateur est connécté et si son token est toujours valide
  // -----------------------------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        setIsLoggedIn(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 3800);
      }
      setIsLoading(false);
    };

    CheckAuth();
  }, []);

  // Liste Fictive des stats
  // -----------------------------------------------------------------------------------------------
  const data = [
    {
      name: "Janvier",
      value: 25,
    },
    {
      name: "Fevrier",
      value: 18,
    },
    {
      name: "Mars",
      value: 32,
    },
  ];

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

  return (
    <main>
      <Navigation />
      <NavigationPhone />
      <ResetScrollOnPage />
      <div className="admin_container">
        {/* <Header /> */}
        <div className="admin_container_infos">
          <div className="content">
            <div className="Title">
              <p className="name">Nombre de Massage</p>
              <p className="subname">3 derniers mois</p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <Bar
                  dataKey="value"
                  fill="#202020"
                  activeBar={<Rectangle fill="#f5bc2e" stroke="#202020" />}
                  label={{
                    position: "under",
                    fill: "#fefefe",
                  }}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="content">
            <p>stats2</p>
          </div>
          <div className="content">
            <p>stats3</p>
          </div>
          <div className="content">
            <p>stats4</p>
          </div>
        </div>
      </div>
    </main>
  );
}
