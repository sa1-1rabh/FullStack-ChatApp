const express = require("express");
const isLoggedIn = require("../middlewares/auth.middlewares");
const {
  handleGetUsers,
  handleSendMessage,
  handleGetMessages,
} = require("../controllers/message.controllers");

const router = express.Router();

router.get("/users", isLoggedIn, handleGetUsers);
router.get("/:id", isLoggedIn, handleGetMessages);
router.post("/send/:id", isLoggedIn, handleSendMessage);

module.exports = router;
