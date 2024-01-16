// Import access to database tables
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const tables = require("../tables");

const currentTime = new Date();
// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    const user = await tables.user.readAll();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    const user = await tables.user.read(req.params.id);

    if (user == null) {
      throw new Error("Utilisateur inconnu");
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the item data from the request body
  const user = req.body;
  const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 19 * 2 ** 10 /* 19 Mio en kio (19 * 1024 kio) */,
    timeCost: 2,
    parallelism: 1,
  };
  // Hash the password and delete the plain password
  const hashedPassword = await argon2.hash(user.password, hashingOptions);
  delete user.password;

  try {
    // Insert the item into the database
    const insertId = await tables.user.create(user, hashedPassword);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted item
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 19 * 2 ** 10 /* 19 Mio en kio (19 * 1024 kio) */,
    timeCost: 2,
    parallelism: 1,
  };
  // Hash the password
  const hashedPassword = await argon2.hash(password, hashingOptions);
  // Replace the plain password with the hashed password
  req.body.hashedPassword = hashedPassword;
  // Hash the password for security
  delete req.body.password;

  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.info(`Nouvelle requête depuis : ${ip}`);
    const user = await tables.user.signIn(email);
    const ActualDate = new Date();
    if (user.length === 1) {
      const verified = await argon2.verify(user[0].password, password);

      if (verified) {
        delete user.password;

        const AdminUserToken = jwt.sign(
          {
            email: user[0].email,
            userId: user[0].id,
            admin: user[0].admin,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        if (user[0].admin === 1) {
          console.info(`Bonjour ${user[0].prenom} ${user[0].nom}`);
          res.cookie("EpimeleiaAdminToken", AdminUserToken, {
            httpOnly: true,
            maxAge: 3600000,
          });

          res.status(200).send({
            message: "Authentification réussie",
            admin: true,
          });
          await tables.user.saveToken(AdminUserToken, email);
          await tables.user.setLastConnexion(ActualDate, email);
        } else {
          throw new Error("Vous n'avez pas les droits d'accès");
        }
      } else {
        throw new Error("Mot de passe incorrect");
      }
    } else {
      throw new Error("Utilisateur inconnu");
    }
  } catch (err) {
    next(err);
  }
};

const checktoken = async (req, res, next) => {
  res.status(200).send({ message: "OK", admin: true });
  console.info(`${currentTime} | Admin Connecté depuis : ${req.ip}`);
  next();
};

const logout = async (req, res, next) => {
  if (!req.cookies.EpimeleiaAdminToken) {
    res.status(403).send({ message: "Vous n'avez pas de Token Actif" });
  } else {
    res.clearCookie("EpimeleiaAdminToken");
    res.status(200).send({ message: "OK", admin: true });
    console.info(`${currentTime} | Admin Déconnecté`);
  }
  next();
};

// The D of BREAD - Destroy (Delete) operation
// This operation is not yet implemented

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  add,
  login,
  checktoken,
  logout,
};
