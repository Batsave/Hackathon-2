const jwt = require("jsonwebtoken");
const tables = require("../tables");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    const ordersList = await tables.orders.readAll();
    res.json(ordersList);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const readWithId = async (req, res, next) => {
  const { LorealAdminToken } = req.cookies;
  const token = LorealAdminToken;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { stylistId } = decodedToken;
  try {
    const StylistInfo = await tables.stylists.readWithId(stylistId);

    if (StylistInfo.length === 1) {
      const ordersList = await tables.orders.readWithSalonId(
        StylistInfo[0].salonId
      );
      if (ordersList == null) {
        res.sendStatus(404);
      } else {
        res.json(ordersList);
      }
    } else {
      throw new Error("Salon of Stylist Id is not Found");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  browse,
  readWithId,
};
