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
const otpRoutes = require("./routes/otpRoutes");
const PendingUser = require("./models/PendingUser");
const registrationRoutes = require("./routes/registrationRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");

const app = express();

connectDB();

// Middleware FIRST


app.use(cors());

app.options("*", cors());

app.use(express.json());

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use("/api/otp", otpRoutes);
app.use("/api/register", registrationRoutes);
app.use(
  "/api/password-reset",
  passwordResetRoutes
);