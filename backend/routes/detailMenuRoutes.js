const express = require("express");
const router = express.Router();
const detailMenuController = require("../controllers/detailMenuController");

router.post("/", detailMenuController.createDetailMenu);
router.get("/", detailMenuController.getAllDetailMenu);
router.get("/:id", detailMenuController.getDetailMenuById);
router.put("/:id", detailMenuController.updateDetailMenu);
router.delete("/:id", detailMenuController.deleteDetailMenu);

module.exports = router;
