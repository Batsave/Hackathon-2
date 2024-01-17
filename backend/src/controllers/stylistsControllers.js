const tables = require("../tables");

const browse = async (req, res, next) => {
  try {
    const stylist = await tables.stylists.readAll();
    res.json(stylist);
  } catch (err) {
    next(err);
  }
};

const readWithId = async (req, res, next) => {
  console.info(req.body);
  try {
    const stylist = await tables.stylists.readWithId(req.params.id);
    if (stylist == null) {
      res.status(404).json({
        message: "invalid Id",
      });
    } else {
      res.json(stylist);
    }
  } catch (err) {
    next(err);
  }
};

const add = async (req, res, next) => {
  const { country, firstname, lastName, stylistRole } = req.body;

  const stylist = {
    country,
    firstname,
    lastName,
    stylistRole,
  };
  try {
    const result = await tables.stylists.create(stylist);
    res.status(201).json({
      id: result.insertId,
      message: "",
    });
  } catch (err) {
    next(err);
  }
};

const edit = async (req, res, next) => {
  const { stylistId } = req.params;
  const { country, firstName, lastName, stylistRole, optinValue } = req.body;
  try {
    const result = await tables.stylists.update(
      country,
      firstName,
      lastName,
      stylistRole,
      optinValue,
      stylistId
    );
    if (result == null) {
      res.status(404).json({ message: "Stylist doesn't exist" });
    } else {
      res.status(200).json({ message: "Stylist has been edited " });
    }
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await tables.stylists.destroy(id);
    if (result) {
      res.json({ message: "Stylist has been deleted" });
    } else {
      res.status(404).json({ message: "Stylist doesn't exist" });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  browse,
  readWithId,
  add,
  edit,
  remove,
};