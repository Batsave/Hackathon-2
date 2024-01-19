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
  addCart,
  setAddCart,
}) {
  const HandleCartClick = (add) => {
    setAddCart([...addCart, add]);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      transition={{ delay: 0.6 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="productCard_value"
    >
      <NavLink to={`/products/${productId}`} className="productCard">
        <p className="productCard_value_fullname">{brand}</p>
        <div className="position_image"> </div>
        <div className="clientCard_value_infos">
          <p className="productCard_value_name">{productName}</p>
          <p className="productCard_value_category">{productCategory}</p>
        </div>
      </NavLink>
      <button
        type="button"
        onClick={() => HandleCartClick(productName)}
        className="button_cart"
      >
        ADD TO CART
      </button>
    </motion.div>
  );
}

ProductListItem.propTypes = {
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  productCategory: PropTypes.string.isRequired,
  addCart: PropTypes.string.isRequired,
  setAddCart: PropTypes.string.isRequired,
};
