const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import itemControllers module for handling item-related operations
const userControllers = require("./controllers/userControllers");
const clientControllers = require("./controllers/clientControllers");
const giftcardControllers = require("./controllers/giftcardControllers");
const multiControllers = require("./controllers/multiControllers");
const nodemailerControllers = require("./controllers/nodemailerControllers");
const ordersControllers = require("./controllers/ordersControllers");
const productsControllers = require("./controllers/productsControllers");
const stylistsControllers = require("./controllers/stylistsControllers");
const orderLinesControllers = require("./controllers/orderLinesControllers");
const emailsControllers = require("./controllers/emailsControllers");
const { checktoken } = require("./services/CheckTokenMiddleware");

// Route to connect user
router.post("/login", userControllers.login);
router.post("/create", userControllers.add);

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

// Route Products
// ---------------------------------------------------------------------
router.get("/product", productsControllers.browse);
router.get("/product/:id", productsControllers.readWithId);

// Route Carte Cadeau
// ---------------------------------------------------------------------

router.get("/giftcard", giftcardControllers.browse);
router.get("/giftcard/info", multiControllers.giftcardInfo);
router.post("/giftcard/add", giftcardControllers.add);
router.get("/giftcard/:id", multiControllers.giftcardInfoWithId);
router.post("/giftcard/update/:id", giftcardControllers.edit);
router.post("/giftcard/delete/:id", giftcardControllers.destroyGiftcardWithId);

// Route Nodemailer
// ---------------------------------------------------------------------
router.post("/nodemailer/send", nodemailerControllers.SendManualMail);

// Email Route
// ---------------------------------------------------------------------
router.get("/email", emailsControllers.browse);

// Orders Route
//---------------------------------------------------------------------
router.get("/order", ordersControllers.readWithId);
router.get("/order/:id", ordersControllers.readWithId);

// Stylists Route
//---------------------------------------------------------------------
router.get("/stylist", stylistsControllers.browse);
router.get("/stylist/:id", stylistsControllers.readWithId);
router.post("/stylist", stylistsControllers.add);
router.put("/stylist/:id", stylistsControllers.edit);
router.delete("/stylist/:id", stylistsControllers.remove);

// OrderLines Route
//---------------------------------------------------------------------
router.get("/orderline", orderLinesControllers.browse);
router.get("/orderline/:id", orderLinesControllers.readWithId);
// router.post("/orderline", orderLinesControllers.add);
// router.put("/orderlines/:id", orderLinesControllers.edit);
// router.delete("/orderline/:id", orderLinesControllers.remove);

/* ************************************************************************* */

module.exports = router;
