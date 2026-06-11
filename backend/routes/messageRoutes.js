const express = require("express");

const {
  sendMessage,
  getMessages,
  getChatUsers,
} = require("../controllers/messageController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendMessage);

router.get("/", protect, getChatUsers);

router.get("/:userId", protect, getMessages);

module.exports = router;