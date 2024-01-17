const tables = require("../tables");

const browse = async (req, res, next) => {
  try {
    const emails = await tables.emails.readAll();
    res.json(emails);
  } catch (err) {
    next(err);
  }
};

module.exports = { browse };
