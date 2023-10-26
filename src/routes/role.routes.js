const router = require("express").Router();
const controller = require("../controllers/role.js");
const { isAuthenticated, multer, authorizeRole } = require("../middlewares");

// access only to auth users
router.use(isAuthenticated);

router.get("/", controller.index);
router.post(
  "/",
  authorizeRole("admin"),
  multer.single("image"),
  controller.store
);
router.patch(
  "/:id",
  authorizeRole("admin"),
  multer.single("image"),
  controller.update
);
router.get("/:id", controller.show);
router.delete("/:id", authorizeRole("admin"), controller.destroy);

module.exports = router;
