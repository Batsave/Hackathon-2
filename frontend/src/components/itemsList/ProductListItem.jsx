import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import "../../scss/components/Products/ProductListItem.scss";

export default function ProductListItem({
  productId,
  brand,
  productName,
  productCategory,
}) {
  function handleClick() {
    window.location.href = `/products/${productId}`;
  }
  return (
    <NavLink onClick={() => handleClick()} className="productCard">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        transition={{ delay: 0.6 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="productCard_value"
      >
        <p className="productCard_value_fullname">{brand}</p>
        <div className="position_image"> </div>
        <div className="clientCard_value_infos">
          <p className="productCard_value_name">{productName}</p>
          <p className="productCard_value_category">{productCategory}</p>
        </div>
      </motion.div>
    </NavLink>
  );
}

ProductListItem.propTypes = {
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  productCategory: PropTypes.string.isRequired,
};
