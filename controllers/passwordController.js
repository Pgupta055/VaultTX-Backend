const Password = require("../models/Password");
const { encrypt, decrypt } = require("../utils/encryption");
const Note = require("../models/Note");
const Identity = require("../models/Identity");
const addPassword = async (req, res) => {
  try {
    const {
      vault,
      website,
      url,
      username,
      password,
      category,
      strength,
      score,
      suggestions,
      requireMasterPassword,
    } = req.body;
    const existingPassword = await Password.findOne({
  user: req.user.id,
  website,
  username,
});

if (existingPassword) {
  return res.status(400).json({
    success: false,
    message: "This account already exists in your vault.",
  });
}

   const encryptedPassword = encrypt(password);

const newPassword = await Password.create({
  
  user: req.user.id,
  website,

  url,
  username,
  password: encryptedPassword,
  category,
  strength,
  score,
  suggestions,
  requireMasterPassword,
});

    res.status(201).json({
      success: true,
      password: newPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getPasswords = async (req, res) => {
  try {
    const passwords = await Password.find({
  user: req.user.id,
}).populate("vault");

    const decryptedPasswords = passwords.map((item) => {
  const obj = item.toObject();

  return {
    ...obj,
    vault: obj.vault?._id,
    password: decrypt(item.password),
  };
});

    res.json({
      success: true,
      passwords: decryptedPasswords,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const importVault = async (req, res) => {
  console.log("========== IMPORT ==========");
console.log(req.body);
console.log("Version:", req.body.version);
console.log("============================");
  try {
    // Validate backup version
    if (req.body.version !== "1.0") {
      return res.status(400).json({
        success: false,
        message: "Unsupported backup version.",
      });
    }

    // Read passwords from the vault object
    const passwords = req.body?.vault?.passwords;
    const notes = req.body?.vault?.notes || [];

const identities =
  req.body?.vault?.identities || [];

    if (!passwords || !Array.isArray(passwords)) {
      return res.status(400).json({
        success: false,
        message: "Invalid backup format.",
      });
    }

    let imported = 0;
    let skipped = 0;

for (const item of passwords) {
      const exists = await Password.findOne({
        user: req.user.id,
        website: item.website,
        username: item.username,
      });



      if (exists) {
        skipped++;
        continue;
      }

      await Password.create({
        user: req.user.id,
        website: item.website,
        url: item.url,
        username: item.username,
        password: encrypt(item.password),
        category: item.category,
        favorite: item.favorite,
        strength: item.strength,
        score: item.score,
        suggestions: item.suggestions,
        requireMasterPassword:
  item.requireMasterPassword,

      });

      imported++;
    }
    for (const item of identities) {

  const exists = await Identity.findOne({
    user: req.user.id,
    title: item.title,
  });

  if (exists) {
    skipped++;
    continue;
}

  await Identity.create({
    user: req.user.id,

    title: item.title,
    fullName: item.fullName,
    email: item.email,
    phone: item.phone,
    streetAddress: item.streetAddress,
    city: item.city,
    state: item.state,
    country: item.country,
    socialAccount: item.socialAccount,
    company: item.company,
    jobTitle: item.jobTitle,

    favorite: item.favorite,
    requireMasterPassword:
      item.requireMasterPassword,
  });
  imported++;

}
    for (const item of notes) {

  const exists = await Note.findOne({
    user: req.user.id,
    title: item.title,
  });

if (exists) {
    skipped++;
    continue;
}

  await Note.create({
    user: req.user.id,
    title: item.title,
    note: item.note,
    favorite: item.favorite,
    requireMasterPassword:
      item.requireMasterPassword,
  });
  imported++;

}

    res.json({
      success: true,
      message: "Vault imported successfully.",
      imported,
      skipped,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const exportVault = async (req, res) => {
  try {
    const passwords = await Password.find({
      user: req.user.id,
    });
const notes = await Note.find({
  user: req.user.id,
});

const identities = await Identity.find({
  user: req.user.id,
});
    const decryptedPasswords = passwords.map((item) => ({
      website: item.website,
      url: item.url,
      username: item.username,
      password: decrypt(item.password),
      category: item.category,
      favorite: item.favorite,
      strength: item.strength,
      score: item.score,
      suggestions: item.suggestions,
      requireMasterPassword:
  item.requireMasterPassword,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
    const exportedNotes = notes.map((item) => ({
  title: item.title,
  note: item.note,
  favorite: item.favorite,
  requireMasterPassword:
    item.requireMasterPassword,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
}));

const exportedIdentities = identities.map((item) => ({
  title: item.title,
  fullName: item.fullName,
  email: item.email,
  phone: item.phone,
  streetAddress: item.streetAddress,
  city: item.city,
  state: item.state,
  country: item.country,
  socialAccount: item.socialAccount,
  company: item.company,
  jobTitle: item.jobTitle,
  favorite: item.favorite,
  requireMasterPassword:
    item.requireMasterPassword,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
}));
console.log("Passwords:", decryptedPasswords.length);
console.log("Notes:", exportedNotes.length);
console.log("Identities:", exportedIdentities.length);

    res.json({
      success: true,

      backup: {
        version: "1.0",

        exportedAt: new Date(),

        vault: {
    passwords: decryptedPasswords,
    notes: exportedNotes,
    identities: exportedIdentities,
},
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const deletePassword = async (req, res) => {
  try {
    const password = await Password.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!password) {
      return res.status(404).json({
        success: false,
        message: "Password not found",
      });
    }

    await password.deleteOne();

    res.json({
      success: true,
      message: "Password deleted successfully",
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
    const password = await Password.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!password) {
      return res.status(404).json({
        success: false,
        message: "Password not found.",
      });
    }

    password.favorite = !password.favorite;

    await password.save();

    res.json({
      success: true,
      favorite: password.favorite,
      message: password.favorite
        ? "Added to favorites."
        : "Removed from favorites.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const updatePassword = async (req, res) => {
  try {
    const passwordDoc = await Password.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!passwordDoc) {
      return res.status(404).json({
        success: false,
        message: "Password not found",
      });
    }

    if (req.body.website !== undefined)
  passwordDoc.website = req.body.website;

if (req.body.url !== undefined)
  passwordDoc.url = req.body.url;

if (req.body.username !== undefined)
  passwordDoc.username = req.body.username;

if (req.body.password !== undefined)
  passwordDoc.password = encrypt(req.body.password);

if (req.body.category !== undefined)
  passwordDoc.category = req.body.category;

if (req.body.vault !== undefined)
  passwordDoc.vault = req.body.vault;

if (req.body.strength !== undefined)
  passwordDoc.strength = req.body.strength;

if (req.body.score !== undefined)
  passwordDoc.score = req.body.score;

if (req.body.suggestions !== undefined)
  passwordDoc.suggestions = req.body.suggestions;

if (req.body.requireMasterPassword !== undefined)
  passwordDoc.requireMasterPassword =
    req.body.requireMasterPassword;

    await passwordDoc.save();

    res.json({
      success: true,
      password: passwordDoc,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getDashboardStats = async (req, res) => {
  try {
    const passwords = await Password.find({
      user: req.user.id,
    });

    const total = passwords.length;

    const favorites = passwords.filter(
      (item) => item.favorite
    ).length;

    const weak = passwords.filter(
      (item) => item.score <= 2
    ).length;

    const strong = passwords.filter(
      (item) => item.score >= 4
    ).length;

    const security =
      total === 0
        ? 100
        : Math.round((strong / total) * 100);

    const recent = passwords
      .sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      .slice(0, 5);

    res.json({
      success: true,
      total,
      favorites,
      weak,
      strong,
      security,
      recent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addPassword,
  getPasswords,
  deletePassword,
  updatePassword,
};
module.exports = {
  addPassword,
  getPasswords,
  updatePassword,
  deletePassword,
  exportVault,
  importVault,
  toggleFavorite,
  getDashboardStats,
};