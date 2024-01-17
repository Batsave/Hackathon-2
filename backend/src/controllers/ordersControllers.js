const tables = require("../tables");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    const ordersList = await tables.products.readAll();
    res.json(ordersList);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const readWithId = async (req, res, next) => {
  console.info(req.body);
  try {
    const ordersList = await tables.orders.readWithId(req.params.id);
    if (ordersList == null) {
      res.sendStatus(404);
    } else {
      res.json(ordersList);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  browse,
  readWithId,
};
