const express = require("express");
const router = express.Router();
const penjualancontroller = require("../controllers/mainPenjualanController");
const { isAuthenticate } = require("../middleware/middleware");

// Header routes
router.post(
  "/header",
  isAuthenticate,
  penjualancontroller.createHeaderPenjualan
);
router.put(
  "/header/:id",
  isAuthenticate,
  penjualancontroller.updateHeaderPenjualan
);

// Detail routes
router.post(
  "/detail",
  isAuthenticate,
  penjualancontroller.createDetailPenjualan
);

// Get routes
router.get("/", isAuthenticate, penjualancontroller.getAllPenjualan);
router.get("/:id", isAuthenticate, penjualancontroller.getPenjualanById);

module.exports = router;
