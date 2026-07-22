const express = require("express");

const router = express.Router();

const {
  addIdentity,
  getIdentities,
  updateIdentity,
  deleteIdentity,
  toggleFavoriteIdentity,
} = require("../controllers/identityController");

const protect = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", addIdentity);

router.get("/", getIdentities);

router.put("/:id", updateIdentity);

router.delete("/:id", deleteIdentity);

router.put("/favorite/:id", toggleFavoriteIdentity);

module.exports = router;