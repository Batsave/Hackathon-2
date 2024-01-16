const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import itemControllers module for handling item-related operations
const userControllers = require("./controllers/userControllers");
const clientControllers = require("./controllers/clientControllers");
const massageControllers = require("./controllers/massageControllers");
const giftcardControllers = require("./controllers/giftcardControllers");
const multiControllers = require("./controllers/multiControllers");
const emailControllers = require("./controllers/emailControllers");
const { checktoken } = require("./services/CheckTokenMiddleware");

// Route to connect user
router.post("/login", userControllers.login);

router.use(checktoken);

router.post("/checktoken", userControllers.checktoken);

// Route to LogOut
router.post("/logout", userControllers.logout);

// Route to verify token

// Route Clients
// ---------------------------------------------------------------------
router.get("/client", clientControllers.browse);
router.get("/client/email", clientControllers.browseWithEmail);
router.post("/client/add", clientControllers.add);
router.get("/client/:id", multiControllers.readClientInfo);
router.post("/client/update/:id", clientControllers.edit);
router.post("/client/delete/:id", multiControllers.destroyUserWithId);

// Route Massage
// ---------------------------------------------------------------------
router.get("/massage", massageControllers.browse);

// Route Carte Cadeau
// ---------------------------------------------------------------------

router.get("/giftcard", giftcardControllers.browse);
router.get("/giftcard/info", multiControllers.giftcardInfo);
router.post("/giftcard/add", giftcardControllers.add);
router.get("/giftcard/:id", multiControllers.giftcardInfoWithId);
router.post("/giftcard/update/:id", giftcardControllers.edit);
router.post("/giftcard/delete/:id", giftcardControllers.destroyGiftcardWithId);

// Route Email
// ---------------------------------------------------------------------
router.post("/email/send", emailControllers.SendManualMail);

/* ************************************************************************* */

module.exports = router;
