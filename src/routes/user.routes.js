const router = require("express").Router();
const controller = require("../controllers/user.js");
const { isAuthenticated, multer, authorizeRole } = require("../middlewares");

// access only to auth users
router.use([isAuthenticated, authorizeRole('admin')]);

router.get("/", controller.index);
router.post("/", multer.single("image"), controller.store);
router.patch("/:id", multer.single("image"), controller.update);
router.route("/:id").get(controller.show).delete(controller.destroy);

module.exports = router;
