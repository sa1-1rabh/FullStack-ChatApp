const express = require("express");
const {
  handleLogin,
  handleSignUp,
  handleLogout,
  handleUpdateProfile,
  checkAuth,
} = require("../controllers/auth.controllers");
const isLoggedIn = require("../middlewares/auth.middlewares");

const router = express.Router();

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);

router.put("/update-profile", isLoggedIn, handleUpdateProfile);

router.get("/check", isLoggedIn, checkAuth);

module.exports = router;
