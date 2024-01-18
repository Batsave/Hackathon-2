import React from "react";
import PropTypes from "prop-types";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function LatestOrders({ orders }) {
  return (
    <section>
      <div className="LatestOrders">
        <h2 className="LatestOrders_title">Latest Orders</h2>
        <div className="LatestOrders_container">
          <div className="LatestOrders_container_head">
            <div>Order ID</div>
            <div>Date</div>
            <div>Quantity</div>
            <div>Amount</div>
          </div>
          {orders.map((order) => (
            <div key={order.orderId} className="LatestOrders_container_body">
              <div>{order.orderId}</div>
              <div>{formatDate(order.orderDate)}</div>
              <div>{order.totalQuantity}</div>
              <div>{order.totalAmount} €</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

LatestOrders.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      orderId: PropTypes.string.isRequired,
      orderDate: PropTypes.string.isRequired,
      totalQuantity: PropTypes.number.isRequired,
      totalAmount: PropTypes.number.isRequired,
    })
  ).isRequired,
};
