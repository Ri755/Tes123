const express = require("express");
const router = express.Router();
const menuManagement = require("../controllers/menuManagementController");
const { isAuthenticate } = require("../middleware/middleware");

// untuk pegawai (pakai token)
router.post("/", isAuthenticate  , menuManagement.addMenu);
router.get("/getall", isAuthenticate  , menuManagement.getMenu);
router.put("/status/:id", isAuthenticate  , menuManagement.ubahStatus);

// untuk customer (gk butuh token)
router.get("/customer/getall" , menuManagement.getMenu);

module.exports = router;