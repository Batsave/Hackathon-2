import React, { useState, useEffect } from "react";
import axios from "axios";
import LatestOrders from "../../components/LatestOrders";

import Navigation from "../../components/NavigationBar";
import NavigationPhone from "../../components/NavigationBarPhone";
import ResetScrollOnPage from "../ResetScrollOnPage";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/order`, {
          withCredentials: true,
        })

        .then((res) => {
          setOrders(res.data);
        });
    } catch (err) {
      console.info(err);
    }
    console.info(orders);
  }, []);

  return (
    <main id="MainContent">
      <Navigation />
      <NavigationPhone />
      <ResetScrollOnPage />

      <div>
        <LatestOrders orders={orders} />
      </div>
    </main>
  );
}
