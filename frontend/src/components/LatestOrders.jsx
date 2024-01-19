import React from "react";
import PropTypes from "prop-types";
import "../scss/components/LatestOrders.scss";

const newformat = (date, format) => {
  const pad = (value) => (value < 10 ? `0${value}` : value);
  const map = {
    mm: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    yyyy: date.getFullYear(),
  };

  return format.replace(/mm|dd|yyyy/gi, (matched) => map[matched]);
};

export default function LatestOrders({ id, date, quantity, amount }) {
  return (
    <div>
      <div className="LatestOrders">
        <div className="LatestOrders_container">
          <div className="LatestOrders_container_head">
            <div>Order ID</div>
            <div>Date</div>
            <div>Quantity</div>
            <div>Amount</div>
          </div>

          <div className="LatestOrders_container_body">
            <div>{id}</div>
            <div className="order_date">
              Date : {newformat(new Date(date), "dd/mm/yyyy")}
            </div>
            <div>{quantity}</div>
            <div>{amount} €</div>
          </div>
        </div>
      </div>
    </div>
  );
}

LatestOrders.propTypes = {
  id: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
};
