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
  console.info("check token in Order");
  const { LorealAdminToken } = req.cookies;
  const token = LorealAdminToken;
  console.info(token);
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  console.info(decodedToken);
  const { stylistId } = decodedToken;
  console.info(stylistId);
  try {
    const StylistInfo = await tables.stylists.readWithId(stylistId);
    console.info(StylistInfo);

    if (StylistInfo.length === 1) {
      const ordersList = await tables.orders.readWithSalonId(
        StylistInfo[0].salonId
      );
      console.info("check token in Order Done");
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
