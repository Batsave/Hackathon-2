const tables = require("../tables");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    const productsList = await tables.products.readAll();
    res.json(productsList);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const readWithId = async (req, res, next) => {
  console.info(req.body);

  try {
    const productsList = await tables.products.readWithId(req.params.id);
    if (productsList == null) {
      res.sendStatus(404);
    } else {
      res.status(200);
    }
    res.json(productsList);
  } catch (err) {
    next(err);
  }
};

// The E of BREAD - Edit operation
const edit = async (req, res, next) => {
  const { productId } = req.params;
  const { brand, productName, productCategory, reducedPrice, reducedQuantity } =
    req.body;
  try {
    const result = await tables.user.update(
      productId,
      brand,
      productName,
      productCategory,
      reducedPrice,
      reducedQuantity
    );
    if (result == null) {
      res.status(404).json({ message: "Product doesn't exist" });
    } else {
      res.status(200).json({ messaage: "Product has been edited" });
    }
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add operation
const add = async (req, res, next) => {
  const {
    productId,
    brand,
    productName,
    productCategory,
    reducedPrice,
    reducedQuantity,
  } = req.body;

  const product = {
    productId,
    brand,
    productName,
    productCategory,
    reducedPrice,
    reducedQuantity,
  };

  try {
    const result = await tables.products.create(product);
    res.status(201).json({
      productId: result.inserId,
      message: "",
    });
  } catch (err) {
    next(err);
  }
};
// The D of BREAD - Delete operation
const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tables.products.destroy(id);
    if (result) {
      res.json({ message: "Product has been deleted" });
    } else {
      res.status(404).json({ message: "Product doesn't exist" });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  browse,
  readWithId,
  edit,
  add,
  remove,
};
