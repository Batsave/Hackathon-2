const jwt = require("jsonwebtoken");
const tables = require("../tables");

const currentTime = new Date();

const checktoken = async (req, res, next) => {
  try {
    if (!req.cookies.LorealAdminToken) {
      throw new Error("Access denied");
    } else {
      const { LorealAdminToken } = req.cookies;
      const token = LorealAdminToken;

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const { email, userId, admin } = decodedToken;
      const checkUserToken = await tables.users.checkToken(token);
      if (
        checkUserToken.length === 1 &&
        checkUserToken[0].email === email &&
        checkUserToken[0].admin === 1 &&
        checkUserToken[0].id === userId &&
        admin === 1
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
