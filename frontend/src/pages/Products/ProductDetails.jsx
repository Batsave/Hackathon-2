import React, { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";
import { useParams } from "react-router-dom";
import Navigation from "../../components/NavigationBar";
import NavigationPhone from "../../components/NavigationBarPhone";
import ResetScrollOnPage from "../ResetScrollOnPage";
import Details from "../../components/details";

import mailError from "../../assets/LottieFiles/EmailError.json";
import "../../scss/ProductDetails.scss";

function ProductDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { id } = useParams();

  const [productList, setProductList] = useState(null);

  useEffect(() => {
    const getProductsList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`,
          {
            withCredentials: true,
          }
        );
        setProductList(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.warn(error);
        setIsLoggedIn(false);
      }
    };
    getProductsList();
    setIsLoading(false);
  }, [id]);

  // Checking if the user is logged in and if their token is still valid
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
          <h1>Access Denied</h1>
          <p className="message">
            {`
          You are not authorized to access this page.`}
            <br /> `You will be redirected to the login page.`
          </p>
        </div>
      </section>
    ); // or render a login component
  }
  return (
    <main id="MainContent">
      <Navigation />
      <NavigationPhone />
      <ResetScrollOnPage />
      <div className="details_Container">
        <div className="logo">
          {productList && <Details products={productList} />}
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
