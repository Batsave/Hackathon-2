// Import access to database tables
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const tables = require("../tables");

// ReadClientInfoWithId
const readClientInfo = async (req, res, next) => {
  try {
    const client = await tables.client.read(req.params.id);
    const giftcards = await tables.carte_cadeau.readWithClientID(client.id);

    if (client == null) {
      res.sendStatus(404);
    } else {
      res.json({
        client,
        giftcards,
      });
    }
  } catch (err) {
    next(err);
  }
};

const giftcardInfo = async (req, res, next) => {
  try {
    const typePaiement = await tables.type_paiement.readAll();
    res.json({ typePaiement });
  } catch (err) {
    next(err);
  }
};

const giftcardInfoWithId = async (req, res, next) => {
  try {
    const giftcard = await tables.carte_cadeau.readWithID(req.params.id);
    const typePaiement = await tables.type_paiement.readAll();
    const clients = await tables.client.readAll();

    res.json({ giftcard, typePaiement, clients });
  } catch (err) {
    next(err);
  }
};

const destroyUserWithId = async (req, res, next) => {
  const { password } = req.body;
  const { LorealAdminToken } = req.cookies;
  const token = LorealAdminToken;
  const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 19 * 2 ** 10 /* 19 Mio en kio (19 * 1024 kio) */,
    timeCost: 2,
    parallelism: 1,
  };
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const hashedPassword = await argon2.hash(password, hashingOptions);
  req.body.hashedPassword = hashedPassword;
  delete req.body.password;

  // Initialisation de la tentative de suppression de données
  // Verification du token
  try {
    console.warn(Date(), ` | Attempt to delete data from IP | ${ip}`);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { email, admin } = decodedToken;

    // Verification de l'identité de l'utilisateur
    const CheckIfUserExist = await tables.user.signIn(email);
    if (CheckIfUserExist.length === 1) {
      // Verification du mot de passe de l'utilisateur
      const CheckAdminPassword = await argon2.verify(
        CheckIfUserExist[0].password,
        password
      );

      if (CheckAdminPassword) {
        delete CheckIfUserExist.password;
        // Verification du pouvoir de l'utilisateur
        if (admin === 1) {
          // Verification de l'existence de l'utilisateur à supprimer
          const client = await tables.client.read(req.params.id);
          if (client === null || client === undefined) {
            throw new Error("The customer does not exist");
          } else {
            // Suppression des données

            await tables.carte_cadeau.deleteWithClientId(req.params.id);
            // await tables.forfait_souscrit.deleteWithClientId(req.params.id);
            // await tables.rdv.deleteWithClientId(req.params.id);

            // and finish by deleting the client
            await tables.client.delete(req.params.id);
            res.status(204).send({ message: "customer data has been deleted" });
            next();
          }
        }
        throw new Error("You do not have the rights to delete the data");
      }
      throw new Error("Wrong password");
    }
    throw new Error("Uou are not connected");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  readClientInfo,
  giftcardInfo,
  destroyUserWithId,
  giftcardInfoWithId,
};
