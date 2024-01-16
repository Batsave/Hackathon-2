const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const tables = require("../tables");

const currentTime = new Date();
// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    const GiftcardsList = await tables.carte_cadeau.readAll();
    const MassagesList = await tables.massage.readAll();
    const ClientsList = await tables.client.readAll();
    res.json({ GiftcardsList, MassagesList, ClientsList });
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const readWithClientID = async (req, res, next) => {
  try {
    const CarteCadeauList = await tables.carte_cadeau.readWithClientID(
      req.params.id
    );
    if (CarteCadeauList == null) {
      res.sendStatus(404);
    } else {
      res.json(CarteCadeauList);
    }
  } catch (err) {
    next(err);
  }
};

const readWithID = async (req, res, next) => {
  try {
    const CarteCadeauList = await tables.carte_cadeau.readWithID(req.params.id);

    if (CarteCadeauList == null) {
      res.sendStatus(404);
    } else {
      res.json(CarteCadeauList);
    }
  } catch (err) {
    next(err);
  }
};

// The E of BREAD - Edit (Update) operation

const edit = async (req, res, next) => {
  const updatedCarteCadeau = {
    client_id: req.body.client_id,
    massage_id: req.body.massage_id,
    forfait_id: req.body.forfait_id,
    montant: req.body.montant,
    paiementType: req.body.paiementType,
    acheteur_id: req.body.acheteur_id,
    utilise: req.body.utilise,
  };
  const { id } = req.params;
  try {
    const CarteCadeau = await tables.carte_cadeau.update(
      id,
      updatedCarteCadeau
    );

    if (CarteCadeau.affectedRows === 0) {
      res.sendStatus(204).send("Aucune carte cadeau trouvé");
    } else {
      res.sendStatus(200);
    }
  } catch (err) {
    next(err);
    console.info(err);
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  const { receveur, acheteur, giftcard } = req.body;

  if (
    (receveur.nom === "" && receveur.prenom === "") ||
    (acheteur.nom === "" && acheteur.prenom === "")
  ) {
    res.status(400).send({ message: "Le receveur ou l'acheteur est manquant" });
    throw new Error("Le receveur ou l'acheteur est manquant");
  }
  let ReceveurID = null;
  let AcheteurID = null;

  // check Receveur exist or not and if not create new one
  const checkNameReceveur = await tables.client.clientNameCheck(
    receveur.nom,
    receveur.prenom
  );
  const checkEmailReceveur = await tables.client.emailCheck(
    receveur.email.trim()
  );
  const checkTelephoneReceveur = await tables.client.telephoneCheck(
    receveur.telephone.trim()
  );

  if (
    checkNameReceveur.length > 0 ||
    (checkNameReceveur.length > 0 && checkEmailReceveur.length > 0) ||
    (checkNameReceveur.length > 0 && checkTelephoneReceveur.length > 0)
  ) {
    ReceveurID = checkNameReceveur[0].id;
  } else {
    const newReceveur = await tables.client.create(receveur);
    ReceveurID = newReceveur;
  }

  // check Acheteur exist or not and if not create new one
  const checkNameAcheteur = await tables.client.clientNameCheck(
    acheteur.nom,
    acheteur.prenom
  );
  const checkEmailAcheteur = await tables.client.emailCheck(
    acheteur.email.trim()
  );
  const checkTelephoneAcheteur = await tables.client.telephoneCheck(
    acheteur.telephone.trim()
  );

  if (
    checkNameAcheteur.length > 0 ||
    (checkNameAcheteur.length > 0 && checkEmailAcheteur.length > 0) ||
    (checkNameAcheteur.length > 0 && checkTelephoneAcheteur.length > 0)
  ) {
    AcheteurID = checkNameAcheteur[0].id;
  } else {
    const newAcheteur = await tables.client.create(acheteur);
    AcheteurID = newAcheteur;
  }

  const newCarteCadeau = {
    client_id: ReceveurID,
    massage_id: giftcard.massageId,
    forfait_id: !giftcard.forfaitId ? null : giftcard.forfaitId,
    montant: giftcard.montant,
    paiementType: giftcard.paiementType,
    acheteur_id: AcheteurID,
    date_achat: currentTime,
    date_expiration: null, // Set automatiquement via la DB a 1 an
    utilise: false,
  };

  const newGiftcardID = await tables.carte_cadeau.create(newCarteCadeau);
  res.status(200).send({ message: "OK", newGiftcardID });
  next();
};

// The D of BREAD - Destroy (Delete) operation
const destroyGiftcardWithId = async (req, res, next) => {
  const { password } = req.body;
  const { EpimeleiaAdminToken } = req.cookies;
  const token = EpimeleiaAdminToken;
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
    console.warn(
      Date(),
      ` | Tentative de suppression de données depuis IP | ${ip}`
    );
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
          const giftcard = await tables.carte_cadeau.readWithID(req.params.id);
          if (giftcard === null || giftcard === undefined) {
            throw new Error("La Carte Cadeau n'existe pas");
          } else {
            console.warn(
              Date(),
              ` | Suppression de la Carte Cadeau | ${giftcard.id} | par | ${email} | depuis IP | ${ip}`
            );
            await tables.carte_cadeau.deleteWithId(req.params.id);
            res
              .status(200)
              .send({ message: "la Carte Cadeau a été supprimée" });
            return;
          }
        }
        throw new Error(
          "Vous n'avez pas les droits pour supprimer les données"
        );
      }
      throw new Error("Mot de passe incorrect");
    }
    res.status(401).send({ message: "Vous n'êtes pas connecté" });
  } catch (err) {
    next(err);
  }
};

// Ready to export the controller functions
module.exports = {
  browse,
  readWithID,
  readWithClientID,
  edit,
  add,
  destroyGiftcardWithId,
};
