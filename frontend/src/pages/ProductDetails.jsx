// import { useEffect, useState } from "react";
// import axios from "axios";
import Details from "../components/details";
import "../scss/ProductDetails.scss";

function ProductDetails() {
  // const [ProductsList, setproductList] = useState([]);

  // useEffect(() => {
  //   const getProductsList = async () => {
  //     try {
  //       const response = await axios.get(
  //         ${import.meta.env.VITE_BACKEND_URL}/api/product,
  //         {
  //           withCredentials: true,
  //         }
  //       );
  //       setproductList(response.data);
  return (
    <div className="detailsContainer">
      <Details />
    </div>
  );
}

export default ProductDetails;
