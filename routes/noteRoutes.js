const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
  toggleFavorite,
} = require("../controllers/noteController");

router.post("/", protect, addNote);

router.get("/", protect, getNotes);

router.put("/:id", protect, updateNote);

router.delete("/:id", protect, deleteNote);
router.put("/:id/favorite", protect, toggleFavorite);

module.exports = router;