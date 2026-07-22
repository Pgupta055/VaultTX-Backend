const express = require("express");

const router = express.Router();

const {
  createVault,
  getVaults,
  updateVault,
  deleteVault,
} = require("../controllers/vaultController");

const protect = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createVault);

router.get("/", getVaults);

router.put("/:id", updateVault);

router.delete("/:id", deleteVault);


module.exports = router;