const router = require("express").Router();
const controller = require("../controllers/adjustment.js");
const { isAuthenticated, authorizeRole, multer } = require("../middlewares");

//router.use(isAuthenticated);


// Excel upload
router.post("/import-excel", multer.single("excel"), controller.importExcel);
router.get("/export-excel", controller.exportExcel);

router.get("/", controller.index);

module.exports = router;