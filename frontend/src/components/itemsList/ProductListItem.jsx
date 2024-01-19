import React from "react";
import PropTypes from "prop-types";
import "../../scss/components/Products/ProductListItem.scss";
import { NavLink } from "react-router-dom";
// import { useState } from "react";

export default function ProductListItem({
  productId,
  brand,
  productName,
  productCategory,
}) {
  return (
    <NavLink to={`/products/${productId}`} className="productCard">
      <div className="productCard_value">
        <p className="productCard_value_fullname">{brand}</p>
        <div className="position_image"> </div>
        <div className="clientCard_value_infos">
          <p className="productCard_value_name">{productName}</p>
          <p className="productCard_value_category">{productCategory}</p>
        </div>
      </div>
    </NavLink>
  );
}

ProductListItem.propTypes = {
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  productCategory: PropTypes.string.isRequired,
};
