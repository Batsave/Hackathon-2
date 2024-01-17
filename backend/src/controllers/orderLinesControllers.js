const tables = require("../tables");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    const orderLinesList = await tables.products.readAll();
    res.json(orderLinesList);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const readWithId = async (req, res, next) => {
  console.info(req.body);
  try {
    const orderLinesList = await tables.orders.readWithId(req.params.id);
    if (orderLinesList == null) {
      res.sendStatus(404);
    } else {
      res.json(orderLinesList);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  browse,
  readWithId,
};
