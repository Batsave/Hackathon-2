// Import access to database tables
const tables = require("../tables");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    const forfaitList = await tables.forfait.readAll();
    res.json(forfaitList);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const readWithId = async (req, res, next) => {
  console.info(req.body);
  try {
    const forfaitList = await tables.forfait.readWithId(req.params.id);
    if (forfaitList == null) {
      res.sendStatus(404);
    } else {
      res.json(forfaitList);
    }
  } catch (err) {
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  const updatedforfait = {
    forfait_info_id: req.body.forfait_info_id,
    client_id: req.body.client_id,
  };
  const { id } = req.params;

  try {
    const forfait = await tables.forfait.update(id, updatedforfait);

    if (forfait.affectedRows === 0) {
      res.sendStatus(204).send("Aucun forfait trouvé");
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  const newforfait = req.body;

  try {
    const insertId = await tables.forfait.create(newforfait);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
  return null;
};

// The D of BREAD - Destroy (Delete) operation

// Ready to export the controller functions
module.exports = {
  browse,
  readWithId,
  edit,
  add,
  // destroy,
};
