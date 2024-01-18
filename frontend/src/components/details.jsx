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
          <h3 className="product_Name">nom du produit</h3>
          <p>texte de description</p>
          <button className="button_add" type="button">
            AJOUTER AU PANIER
          </button>
        </div>
      </div>
      <p className="description">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. In cumque
        consectetur natus beatae voluptatibus ut, neque aliquid asperiores
        vitae? Temporibus saepe laudantium eum fugiat neque placeat aliquid
        sint, animi est quas, tempora sit, possimus dolorem. Reprehenderit
        necessitatibus quia delectus eum.
      </p>
    </div>
  );
}

export default Details;
