const router = require("express").Router();
const controller = require("../controllers/product.js");
const { isAuthenticated, multer, authorizeRole } = require("../middlewares");

// router.use(isAuthenticated);

// Excel upload
router.post("/import-excel", multer.single("excel"), controller.importExcel);
router.get("/export-excel", controller.exportExcel);

router.get("/", controller.index);
router.post("/", multer.single("image"), controller.store);
router.patch("/:id", multer.single("image"), controller.update);
router.get("/:id", controller.show);
router.delete("/:id", authorizeRole("admin"), controller.destroy);

module.exports = router;
