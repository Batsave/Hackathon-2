import React, { useState, useEffect } from "react";
import axios from "axios";
import LatestOrders from "../components/LatestOrders";

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
    <div>
      <LatestOrders orders={orders} />
    </div>
  );
}
