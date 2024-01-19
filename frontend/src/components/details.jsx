/* eslint-disable react/prop-types */
import "../scss/components/Details.scss";
import imgOne from "../../public/assets/jpg/img_one.jpg";
import imgTwo from "../../public/assets/jpg/img_two.jpg";
import imgThree from "../../public/assets/jpg/img_three.jpg";
import imgFour from "../../public/assets/jpg/img_four.jpg";

function Details({ products }) {
  return (
    <div>
      <div className="details" key={products.productId}>
        <h2 className="brand">{products.brand}</h2>
        <div className="product_and_add_container">
          <div className="img_Container">
            <img className="picture" src={imgOne} alt="" />
            <img className="picture" src={imgTwo} alt="" />
            <img className="picture" src={imgThree} alt="" />
            <img className="picture" src={imgFour} alt="" />
          </div>
          <div className="add_Products">
            <h3 className="product_Name">{products.productName}</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
              laudantium porro cum est eos adipisci blanditiis nesciunt
              praesentium in aliquid.
            </p>
            <button className="button_add" type="button">
              AJOUTER AU PANIER
            </button>
          </div>
        </div>
        <p className="description">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium,
          repellat! Aspernatur harum, rem, odit iusto consequuntur aut
          voluptatem fugit maxime nihil sint culpa numquam dolorem nam pariatur
          repellendus ut similique.
        </p>
      </div>
    </div>
  );
}

export default Details;
