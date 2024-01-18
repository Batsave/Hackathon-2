// Import access to database tables
const tables = require("../tables");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    const client = await tables.client.readAll();
    res.status(200).json(client);
  } catch (err) {
    next(err);
  }
};

const browseWithEmail = async (req, res, next) => {
  try {
    const user = await tables.client.readIfEmail();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    const client = await tables.client.read(req.params.id);

    if (client == null) {
      res.sendStatus(404);
    } else {
      res.json(client);
    }
  } catch (err) {
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation
const edit = async (req, res, next) => {
  const updatedClient = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    telephone: req.body.telephone,
    adresse: req.body.adresse,
    code_postal: req.body.codePostal,
    ville: req.body.ville,
    notes: req.body.notes,
  };
  const { id } = req.params;

  try {
    const client = await tables.client.update(id, updatedClient);

    if (client.affectedRows === 0) {
      throw new Error("Client introuvable");
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the item data from the request body
  const newClient = req.body;

  try {
    const checkName = await tables.client.clientNameCheck(
      newClient.nom,
      newClient.prenom
    );
    const checkEmail = await tables.client.emailCheck(newClient.email);
    const checkTelephone = await tables.client.telephoneCheck(
      newClient.telephone
    );
    if (
      checkName.length > 0 &&
      checkEmail.length > 0 &&
      checkTelephone.length > 0
    ) {
      return res.status(409).json({ message: "Customer already exists " });
    }
    if (checkEmail.length > 0 && !checkEmail.value === undefined) {
      return res.status(409).json({
        message: "The email address provided is already linked to a customer",
      });
    }
    if (checkTelephone.length > 0 && !checkTelephone.value === undefined) {
      return res.status(409).json({
        message: "The phone number provided is already linked to a customer",
      });
    }
    const insertId = await tables.client.create(newClient);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
  return null;
};

// The D of BREAD - Destroy (Delete) operation
// This operation is not yet implemented
const destroy = async (req, res) => {
  const { id } = req.params;
  const deleteClient = await tables.client.delete(id);
  if (!deleteClient) {
    res.sendStatus(204).send("Customer doesn't exist");
    throw new Error("User not f");
  }
  res.sendStatus(200).send("Client Successfully Deleted");
  return deleteClient;
};

// Ready to export the controller functions
module.exports = {
  browse,
  browseWithEmail,
  read,
  edit,
  add,
  destroy,
};
