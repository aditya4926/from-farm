const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getNotifications,
  getUnreadCount,
} = require("../controllers/notificationController");

router.get("/", protect, getNotifications);
router.get("/count",protect,getUnreadCount);

module.exports = router;