const router = require("express").Router();
const controller = require("../controllers/sale.js");
const { isAuthenticated, authorizeRole } = require("../middlewares");

router.use(isAuthenticated);

router.get("/", controller.index);
router.post("/", controller.store);
router.patch("/:id", authorizeRole("admin"), controller.update);
router.get("/:id", controller.show);
router.delete("/:id", authorizeRole("admin"), controller.destroy);

module.exports = router;
