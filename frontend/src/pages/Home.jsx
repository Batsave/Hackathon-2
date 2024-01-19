import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";
import { Link } from "react-router-dom";
import "../scss/home.scss";
import "../scss/pages.scss";
import Navigation from "../components/NavigationBar";
import NavigationPhone from "../components/NavigationBarPhone";
import ResetScrollOnPage from "./ResetScrollOnPage";

import mailError from "../assets/LottieFiles/EmailError.json";

export default function Admin() {
  // Checking if the user is logged in and if their token is still valid
  // -----------------------------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    const GetData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/order`,
          {
            withCredentials: true,
          }
        );
        setOrdersList(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setTimeout(() => {
          window.location.href = "/";
        }, 3800);
      }
      setIsLoading(false);
    };

    GetData();
  }, []);

  const newformat = (date, format) => {
    const pad = (value) => (value < 10 ? `0${value}` : value);
    const map = {
      mm: pad(date.getMonth() + 1),
      dd: pad(date.getDate()),
      yyyy: date.getFullYear(),
    };

    return format.replace(/mm|dd|yyyy/gi, (matched) => map[matched]);
  };

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
            <div className="last_order_header">
              <h2 className="last_order_header_title">Last orders</h2>
              <Link to="/orders" className="SeeMore">
                See more
              </Link>
            </div>

            <div className="last_order_product">
              {ordersList.slice(0, 3).map((order) => (
                <div className="order" key={order.orderId}>
                  <div className="order_infos">
                    <p className="order_infos_date">
                      {newformat(new Date(order.orderDateTime), "yyyy/mm/dd")}
                    </p>
                    <p className="order_infos_number">
                      Order n° {order.orderId}
                    </p>
                  </div>
                  <div className="order_values">
                    <div className="order_values_price line">
                      <p className="title">Price</p>
                      <p className="value">{order.totalAmount} €</p>
                    </div>
                    <div className="order_values_price line qtproduct">
                      <p className="title">Qt Products</p>
                      <p className="value">{order.totalQuantity}</p>
                    </div>
                    <div className="order_values_price">
                      <Link
                        className="order_values_price_button"
                        to={`/orders/${order.orderId}`}
                      >
                        +
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="admin_container_ad">
            <h2 className="admin_container_ad_title">Recommanded products</h2>
            <div className="admin_container_ad_content">
              <p>
                Hydrate and Glow with <br />
                <span className="name">Moisturizer Magic !</span>
              </p>
            </div>
          </div>
        </div>
        <div className="admin_container_adfull">
          <div className="admin_container_adfull_content">
            <div className="content_1" />
            <div className="content_2">
              <p className="tagline">Witness</p>
              <h3 className="title">The pro's opinion</h3>
              <p className="textDesc">
                "We don't just beautify hair, we give it new structure, new
                strength and say goodbye to rubbery hair."
              </p>
              <p className="undertext">
                The Absolut Repair Molecular range was co-developed with repair
                professionals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
