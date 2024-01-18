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
  const [productList, setproductList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuantity, setSearchQuantity] = useState("");
  const [sortByProduct, setSortByProduct] = useState("");
  // Verification si l'utilisateur est connécté et si son token est toujours valide
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const getProductsList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product`,
          {
            withCredentials: true,
          }
        );
        setproductList(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(true);
        /* setTimeout(() => {
          window.location.href = "/";
        }, 3800); */
      }
    };
    getProductsList();
    setIsLoading(false);
  }, []);
  // search function
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const filteredProducts = productList.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchQuantity(
      searchValue.length === 0
        ? `${productList.length} Products`
        : `${filteredProducts.length} / ${productList.length} Products`
    );
    setSearchResult(filteredProducts);
  }, [searchValue, productList]);

  // filtered by brand
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const sortedProducts = [...productList].sort((a, b) => {
      if (sortByProduct === "AtoZ") {
        return a.brand.localeCompare(b.brand);
      }
      if (sortByProduct === "ZtoA") {
        return b.brand.localeCompare(a.brand);
      }

      return null;
    });
    setSearchResult(sortedProducts);
  }, [sortByProduct, productList]);

  if (isLoading) {
    return null;
  }

  if (isLoading) {
    return null;
  }
  const generateImage =
    "https://image.lexica.art/full_webp/d71f6921-7522-4a7b-b527-4504bb732715";

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
        <div className="logo_class" alt="logo" />
        <header className="banner_product">
          <div className="banner_black">
            <p>
              RETROUVER-ICI VOS<strong> PRODUITS STARS </strong>
              Réunis dans des sets exclusifs
              <p>
                DES MILLIERS D'ARTICLES A PRIX <strong>PRO</strong>
              </p>
            </p>
          </div>
        </header>
        <div className="products_container_filter">
          <div className="clients_container_filter_box">
            <form className="clients_container_filter_box_form">
              <input
                type="text"
                id="searchClient"
                className="clients_container_filter_box_form_input"
                placeholder=" search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>
            <p>Brand: </p>
            <select
              value={sortByProduct}
              onChange={(e) => setSortByProduct(e.target.value)}
              className="clients_container_filter_box_sort"
            >
              <option value="">Trier par...</option>
              <option value="AtoZ">A à Z</option>
              <option value="ZtoA">Z à A</option>
            </select>
          </div>
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
            <>
              {searchResult.map((product) => (
                <ClientListItem
                  className="products_container_list_item"
                  key={product.id}
                  id={product.id}
                  generateImage={generateImage}
                  brand={product.brand}
                  productName={product.productName}
                  productCategory={product.productCategory}
                />
              ))}
            </>
          ) : (
            <div>
              {productList.map((product) => (
                <ClientListItem
                  className="products_container_list_item"
                  key={product.id}
                  id={product.id}
                  generateImage={generateImage}
                  brand={product.brand}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
