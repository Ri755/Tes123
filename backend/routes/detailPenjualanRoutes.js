const express = require("express");
const router = express.Router();
const detailcontroller = require("../controllers/detailPenjualanController");
const { isAuthenticate } = require("../middleware/middleware");

// Header routes
router.post("/header", isAuthenticate, detailcontroller.createHeaderPenjualan);
router.put(
  "/header/:id",
  isAuthenticate,
  detailcontroller.updateHeaderPenjualan
);

// Detail routes
router.post("/detail", isAuthenticate, detailcontroller.createDetailPenjualan);
router.delete(
  "/detail/:id",
  isAuthenticate,
  detailcontroller.deleteDetailPenjualan
);

// Get routes
router.get("/", isAuthenticate, detailcontroller.getAllPenjualan);
router.get("/:id", isAuthenticate, detailcontroller.getPenjualanById);
router.get(
  "/details/:headerId",
  isAuthenticate,
  detailcontroller.getDetailByHeaderId
);

module.exports = router;
