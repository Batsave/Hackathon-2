// Import access to database tables
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const tables = require("../tables");

const currentTime = new Date();
// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    const users = await tables.users.readAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    const users = await tables.users.read(req.params.id);

    if (users == null) {
      throw new Error("Unknown users");
    } else {
      res.json(users);
    }
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the item data from the request body
  const users = req.body;
  const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 19 * 2 ** 10 /* 19 Mio en kio (19 * 1024 kio) */,
    timeCost: 2,
    parallelism: 1,
  };
  // Hash the password and delete the plain password
  const hashedPassword = await argon2.hash(users.password, hashingOptions);
  delete users.password;

  try {
    // Insert the item into the database
    const insertId = await tables.users.create(users, hashedPassword);

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
    console.info(`New request from : ${ip}`);
    const users = await tables.users.signIn(email);
    const ActualDate = new Date();
    if (users.length === 1) {
      const verified = await argon2.verify(users[0].password, password);

      if (verified) {
        delete users.password;

        const AdminusersToken = jwt.sign(
          {
            email: users[0].email,
            usersId: users[0].id,
            admin: users[0].admin,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        if (users[0].admin === 1) {
          console.info(`Welcome ${users[0].prenom} ${users[0].nom}`);
          res.cookie("LorealAdminToken", AdminusersToken, {
            httpOnly: true,
            maxAge: 3600000,
          });

          res.status(200).send({
            message: "Authentication is a success",
            admin: true,
          });
          await tables.users.saveToken(AdminusersToken, email);
          await tables.users.setLastConnexion(ActualDate, email);
        } else {
          throw new Error("You have no access here");
        }
      } else {
        throw new Error("Incorrect password");
      }
    } else {
      throw new Error("Unknown users");
    }
  } catch (err) {
    next(err);
  }
};

const checktoken = async (req, res, next) => {
  res.status(200).send({ message: "OK", admin: true });
  console.info(`${currentTime} | Admin connected for : ${req.ip}`);
  next();
};

const logout = async (req, res, next) => {
  if (!req.cookies.LorealAdminToken) {
    res.status(403).send({ message: "Your Token is not active" });
  } else {
    res.clearCookie("LorealAdminToken");
    res.status(200).send({ message: "OK", admin: true });
    console.info(`${currentTime} | Admin is disconnected`);
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
