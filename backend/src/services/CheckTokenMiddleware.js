const jwt = require("jsonwebtoken");
const tables = require("../tables");

const currentTime = new Date();

const checktoken = async (req, res, next) => {
  try {
    if (!req.cookies.EpimeleiaAdminToken) {
      throw new Error("Acces Refusé");
    } else {
      const { EpimeleiaAdminToken } = req.cookies;
      const token = EpimeleiaAdminToken;

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const { email, userId, admin } = decodedToken;
      const checkUserToken = await tables.user.checkToken(token);
      if (
        checkUserToken.length === 1 &&
        checkUserToken[0].email === email &&
        checkUserToken[0].admin === 1 &&
        checkUserToken[0].id === userId &&
        admin === 1
      ) {
        next();
      } else {
        throw new Error("Acces Refusé");
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
