const Note = require("../models/Note");

const addNote = async (req, res) => {
  try {
   const {
  title,
  note,
  favorite,
  requireMasterPassword,
  vault,
} = req.body;

    const newNote = await Note.create({
      user: req.user.id,
      title,
      note,
      favorite,
      requireMasterPassword,
      vault,
    });

    res.json({
      success: true,
      message: "Note saved successfully.",
      note: newNote,
    });
  } catch (error) {
  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

const getNotes = async (req, res) => {
  try {

    const notes = await Note.find({
      user: req.user.id,
    })
      .populate("vault")
      .sort({
        createdAt: -1,
      });

    const formattedNotes = notes.map((item) => {
      const obj = item.toObject();

      return {
        ...obj,
        vault: obj.vault?._id || null,
      };
    });

    res.json({
      success: true,
      notes: formattedNotes,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const updateNote = async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("PARAM:", req.params.id);

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    console.log("UPDATED:", note);

    res.json({
      success: true,
      note,
    });

  } catch (error) {

    console.log("ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const deleteNote = async (req, res) => {
  try {
    await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({
      success: true,
      message: "Note deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const toggleFavorite = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.json({
        success: false,
        message: "Note not found.",
      });
    }

    note.favorite = !note.favorite;
    if (vault !== undefined) {
    note.vault = vault;
}
    await note.save();

    res.json({
      success: true,
      favorite: note.favorite,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
  toggleFavorite,
};