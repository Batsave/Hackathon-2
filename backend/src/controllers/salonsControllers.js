const tables = require("../tables");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    const salons = await tables.salons.readAll();
    res.json(salons);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const readWithId = async (req, res, next) => {
  console.info(req.body);
  try {
    const salon = await tables.salons.readWithId(req.params.id);
    if (salon == null) {
      res.sendStatus(404);
    } else {
      res.json(salon);
    }
  } catch (err) {
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  const updatedSalons = {
    salonName: req.body.salonName,
    city: req.body.city,
    contry: req.body.country,
  };
  const { id } = req.params;

  try {
    const salons = await tables.salons.update(id, updatedSalons);

    if (salons.affectedRows === 0) {
      throw new Error("Salons introuvable");
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  browse,
  readWithId,
  edit,
};
