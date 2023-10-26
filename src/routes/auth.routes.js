const router = require("express").Router();
const controller = require("../controllers/auth.js");

router.post(
  "/signup",
  controller.signup
);

router.post("/signin", controller.signin);

router.post("/signout", controller.signout);

router.post("/refresh", controller.refreshTokens);

module.exports = router;
