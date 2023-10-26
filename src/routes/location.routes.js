const router = require("express").Router();
const controller = require("../controllers/location.js");
const { isAuthenticated, authorizeRole, multer } = require("../middlewares");

router.use(isAuthenticated);

// Excel upload
router.post("/import-excel", multer.single("excel"), controller.importExcel);
router.get("/export-excel", controller.exportExcel);

router.get("/", controller.index);
router.post("/", controller.store);
router.patch("/:id", controller.update);
router.get("/:id", controller.show);
router.delete("/:id", authorizeRole("admin"), controller.destroy);

module.exports = router;
