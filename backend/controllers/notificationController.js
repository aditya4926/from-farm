const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const notifications =
      await Notification.find({
        userId: req.user._id,
      }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
};