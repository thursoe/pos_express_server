const router = require("express").Router();
const controller = require("../controllers/stock.js");
const { isAuthenticated, authorizeRole } = require("../middlewares");

router.use(isAuthenticated);

// Excel export
router.get("/export-excel", controller.exportExcel);

router.get("/", controller.index);
router.post("/", authorizeRole("admin"), controller.store);
router
  .route("/:id")
  .all(authorizeRole("admin"))
  .get(controller.show)
  .patch(controller.update)
  .delete(controller.destroy);

module.exports = router;
