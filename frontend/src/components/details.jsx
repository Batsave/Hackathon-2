import "../scss/components/Details.scss";

function Details() {
  return (
    <div className="details">
      <h2 className="brand">brand</h2>
      <div className="product_and_add_container">
        <div className="img_Container">
          <img className="picture" src="" alt="" />
          <img className="picture" src="" alt="" />
          <img className="picture" src="" alt="" />
          <img className="picture" src="" alt="" />
        </div>
        <div className="add_Products">
          <h3>nom du produit</h3>
          <p>texte de description</p>
          <button type="button">AJOUTER AU PANIER</button>
        </div>
      </div>
      <p className="description">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates
        impedit nam quos vero facere ea fuga dolore maxime repellat rerum.
      </p>
    </div>
  );
}

export default Details;
