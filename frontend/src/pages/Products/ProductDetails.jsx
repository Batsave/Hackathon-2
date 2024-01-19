import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navigation from "../../components/NavigationBar";
import NavigationPhone from "../../components/NavigationBarPhone";
import ResetScrollOnPage from "../ResetScrollOnPage";
import Details from "../../components/details";

import "../../scss/ProductDetails.scss";

function ProductDetails() {
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
      } catch (error) {
        console.warn(error);
      }
    };
    getProductsList();
  }, [id]);

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
