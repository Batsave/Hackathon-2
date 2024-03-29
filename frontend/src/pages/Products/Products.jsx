import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";

import "../../scss/Products/products.scss";
import "../../scss/Products/productID.scss";
import Navigation from "../../components/NavigationBar";
import NavigationPhone from "../../components/NavigationBarPhone";
import ScrollToTop from "../ResetScrollOnPage";

import mailError from "../../assets/LottieFiles/EmailError.json";
import ProductListItem from "../../components/itemsList/ProductListItem";

export default function Clients() {
  // Stockage des informations de connexion
  // -----------------------------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Stockage des informations des clients
  // -----------------------------------------------------------------------------------------------
  const [productList, setproductList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuantity, setSearchQuantity] = useState("");
  const [sortByProduct, setSortByProduct] = useState("");
  const [addCart, setAddCart] = useState([]);
  // Verification si l'utilisateur est connécté et si son token est toujours valide
  // -----------------------------------------------------------------------------------------------

  useEffect(() => {
    const getProductsList = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/`,
          {
            withCredentials: true,
          }
        );
        await setproductList(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        // setTimeout(() => {
        //   window.location.href = "/";
        // }, 3800);
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
        product.brand.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.productCategory
          .toLowerCase()
          .includes(searchValue.toLowerCase())
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
    <main id="MainContent" className="products_page">
      <Navigation />
      <NavigationPhone />
      <ScrollToTop />
      <div className="product_container">
        <div className="logo_class" alt="logo" />
        <header className="banner_product">
          <div className="banner_gold">
            <p>
              Explore the
              <strong> Wild Code </strong> of beauty.
            </p>
          </div>
          <div className="banner_black">
            <div>
              <p>
                FIND YOUR <strong> STAR PRODUCTS HERE </strong>
                Brought together in exclusive sets
              </p>
              <p>
                THOUSANDS OF ITEMS AT <strong>PRO PRICES.</strong>
              </p>
            </div>
          </div>
        </header>
        <div className="products_container_filter">
          <form className="products_container_filter_box_form">
            <input
              type="text"
              id="searchClient"
              className="products_container_filter_box_form_input"
              placeholder=" search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>
          <div className="products_container_filter_box">
            <select
              value={sortByProduct}
              onChange={(e) => setSortByProduct(e.target.value)}
              className="products_container_filter_box_sort"
            >
              <option value="">Order by...</option>
              <option value="AtoZ">A à Z</option>
              <option value="ZtoA">Z à A</option>
            </select>
          </div>
        </div>
        <div className="resultQuantity">
          <p>{searchQuantity}</p>
        </div>
        {searchResult.length === 0 && searchValue !== "" ? (
          <p className="resultQuantity">no result found....</p>
        ) : null}
        <div className="product_container_list">
          {searchResult.length !== 1 ? (
            <>
              {searchResult.map((product) => (
                <ProductListItem
                  className="products_container_list_item"
                  key={product.productId}
                  productId={product.productId}
                  brand={product.brand}
                  productName={product.productName}
                  productCategory={product.productCategory}
                  addCart={addCart}
                  setAddCart={setAddCart}
                />
              ))}
            </>
          ) : (
            <div>
              {productList.map((product) => (
                <ProductListItem
                  className="products_container_list_item"
                  key={product.id}
                  id={product.id}
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
