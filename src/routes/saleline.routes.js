const router = require("express").Router();
const controller = require("../controllers/saleline.js");
const { isAuthenticated, authorizeRole } = require("../middlewares/index.js");

router.use(isAuthenticated);

// Excel export
router.get("/export-excel", controller.exportExcel);

router.get("/", controller.index);
router.get("/:id", controller.show);
router.delete("/:id", authorizeRole("admin"), controller.destroy);

module.exports = router;
