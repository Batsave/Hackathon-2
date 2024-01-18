const jwt = require("jsonwebtoken");

const tables = require("../tables");

const currentTime = new Date();

const checktoken = async (req, res, next) => {
  try {
    if (!req.cookies.LorealAdminToken) {
      console.warn("rekt no token");
      throw new Error("Access denied");
    } else {
      const { LorealAdminToken } = req.cookies;

      const token = LorealAdminToken;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const { email, stylistId } = decodedToken;
      const checkUserToken = await tables.users.checkToken(email);

      if (
        checkUserToken.length === 1 &&
        checkUserToken[0].email === email &&
        checkUserToken[0].stylistId === stylistId
      ) {
        next();
      } else {
        throw new Error("Access Denied");
      }
    }
  } catch (err) {
    console.warn(`${currentTime} | ${err}`);
    res.sendStatus(401);
    next(err);
  }
};

module.exports = {
  checktoken,
};
