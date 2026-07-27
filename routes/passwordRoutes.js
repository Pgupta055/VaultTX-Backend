const express = require("express");

const router = express.Router();

const {
  addPassword,
  getPasswords,
  getPasswordsByDomain,
  updatePassword,
  deletePassword,
  exportVault,
  importVault,
  toggleFavorite,
  getDashboardStats,
} = require("../controllers/passwordController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, addPassword);
router.get(
  "/domain/:domain",
  protect,
  getPasswordsByDomain
);
router.get("/", protect, getPasswords);
router.delete("/:id", protect, deletePassword);
router.put("/:id", protect, updatePassword);
router.get("/backup", protect, exportVault);
router.put("/:id/favorite", protect, toggleFavorite);
router.post(
  "/import",
  protect,
  importVault
);
router.get(
  "/dashboard",
  protect,
  getDashboardStats
);


module.exports = router;