import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";
import LatestOrders from "../../components/LatestOrders";
import "../../scss/orders.scss";

import Navigation from "../../components/NavigationBar";
import NavigationPhone from "../../components/NavigationBarPhone";
import ResetScrollOnPage from "../ResetScrollOnPage";

import mailError from "../../assets/LottieFiles/EmailError.json";

export default function Orders() {
  // Stockage des informations de connexion
  // -----------------------------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Stockage des informations des clients
  // -----------------------------------------------------------------------------------------------
  const [orders, setOrders] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuantity, setSearchQuantity] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const getLatestOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/order`,
          {
            withCredentials: true,
          }
        );

        setOrders(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setTimeout(() => {
          window.location.href = "/";
        }, 3800);
      }
    };
    getLatestOrders();
    setIsLoading(false);
  }, []);

  // Fonction de recherche
  // -----------------------------------------------------------------------------------------------

  useEffect(() => {
    const filteredOrders = orders.filter(
      (order) =>
        order.orderDateTime.toLowerCase().includes(searchValue.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchValue.toLowerCase()) ||
        order.salonId.toLowerCase().includes(searchValue.toLowerCase()) ||
        order.totalAmount.toString().includes(searchValue.toString()) ||
        order.totalQuantity.toString().includes(searchValue.toString())
    );
    setSearchQuantity(
      searchValue.length === 0
        ? `${orders.length} orders`
        : `${filteredOrders.length} / ${orders.length} orders`
    );
    setSearchResult(filteredOrders);
  }, [searchValue, orders]);

  // Fonction de tri
  // -----------------------------------------------------------------------------------------------
  useEffect(() => {
    const sortedOrders = [...orders].sort((a, b) => {
      if (sortBy === "quantityDesc") {
        return a.totalQuantity
          .toString()
          .localeCompare(b.totalQuantity.toString());
      }
      if (sortBy === "quantityAsc") {
        return b.totalQuantity
          .toString()
          .localeCompare(a.totalQuantity.toString());
      }
      if (sortBy === "amountDesc") {
        return a.totalAmount.toString().localeCompare(b.totalAmount.toString());
      }
      if (sortBy === "amountAsc") {
        return b.totalAmount.toString().localeCompare(a.totalAmount.toString());
      }
      if (sortBy === "dateDesc") {
        return new Date(b.orderDateTime) - new Date(a.orderDateTime);
      }
      if (sortBy === "dateAsc") {
        return new Date(a.orderDateTime) - new Date(b.orderDateTime);
      }

      return null;
    });
    setSearchResult(sortedOrders);
  }, [orders, sortBy]);

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
    <main id="MainContent">
      <Navigation />
      <NavigationPhone />
      <ResetScrollOnPage />
      <div className="orders-container">
        <h2 className="orders-title">Last Orders</h2>
        <div className="orders_container_filter">
          <div className="orders_container_filter_box">
            <form className="orders_container_filter_box_form">
              <label className="orders_container_filter_box_form_icon">
                {}
              </label>
              <input
                type="text"
                id="searchOrder"
                className="orders_container_filter_box_form_input"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="orders_container_filter_box_sort"
            >
              <option value="">Sort by...</option>
              <option value="dateAsc">Date Ascending</option>
              <option value="dateDesc">Date Descending</option>
              <option value="quantityAsc">Quantity Ascending</option>
              <option value="quantityDesc">Quantity Descending</option>
              <option value="amountAsc">Amount Ascending</option>
              <option value="amountDesc">Amount Descending</option>
            </select>
          </div>

          <div className="resultQuantity">
            <p>{searchQuantity}</p>
          </div>
          {searchResult.length === 0 && searchValue !== "" ? (
            <p className="OrderNotFound">
              Aucun résultat ne correspond à votre recherche.
            </p>
          ) : null}

          <div className="orders_container_list">
            {searchResult.length !== 0 ? (
              <div>
                {searchResult.map((order) => (
                  <LatestOrders
                    className="orders_container_list_item"
                    key={order.orderId}
                    id={order.orderId}
                    date={order.orderDateTime}
                    quantity={order.totalQuantity}
                    amount={order.totalAmount}
                  />
                ))}
              </div>
            ) : (
              <div>
                {orders.map((order) => (
                  <LatestOrders
                    className="orders_container_list_item"
                    key={order.orderId}
                    id={order.orderId}
                    date={order.orderDateTime}
                    quantity={order.totalQuantity}
                    amount={order.totalAmount}
                  />
                ))}
              </div>
            )}
          </div>
          <div>
            <LatestOrders orders={orders} />
          </div>
        </div>
      </div>
    </main>
  );
}
