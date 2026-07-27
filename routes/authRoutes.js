const {
  register,
  login,
  logout,
  verifyMasterPassword,
  getProfile,

  changePassword,
  changeMasterPassword,
  deleteAccount,
  testEmail,

} = require("../controllers/authController");

const express = require("express");
const protect = require("../middleware/authMiddleware");
const router = express.Router();
const auth = require("../middleware/authMiddleware");


router.post("/register", register);
router.post("/login", login);
router.post(
  "/verify-master-password",
  protect,
  verifyMasterPassword
);
router.get("/profile", auth, getProfile);
router.put(
  "/change-password",
  protect,
  changePassword
);

router.put(
  "/change-master-password",
  protect,
  changeMasterPassword
);
router.delete(
  "/delete-account",
  protect,
  deleteAccount
);
router.post("/test-email", testEmail);
router.post("/logout", protect, logout);
module.exports = router;