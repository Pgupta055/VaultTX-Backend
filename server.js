const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const loginActivityRoutes = require("./routes/loginActivityRoutes");

const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const noteRoutes = require("./routes/noteRoutes");
const identityRoutes = require("./routes/identityRoutes");
const vaultRoutes = require("./routes/vaultRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

connectDB();

// Middleware FIRST
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// Routes AFTER middleware
app.use("/api/auth", authRoutes);
app.use("/api/passwords", passwordRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/identities", identityRoutes);
app.use("/api/vaults", vaultRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/login-activity", loginActivityRoutes);

app.get("/", (req, res) => {
  res.send("Password Manager Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});