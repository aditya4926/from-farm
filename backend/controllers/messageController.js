const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.userId;

    const messages = await Message.find({
      $or: [
        {
          senderId: req.user._id,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: req.user._id,
        },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getChatUsers = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id },
        { receiverId: req.user._id },
      ],
    })
      .populate("senderId", "name mobile role")
      .populate("receiverId", "name mobile role")
      .sort({ updatedAt: -1 });

    const users = [];

    messages.forEach((msg) => {
      const otherUser =
        msg.senderId._id.toString() === req.user._id.toString()
          ? msg.receiverId
          : msg.senderId;

      const exists = users.find(
        (u) => u._id.toString() === otherUser._id.toString()
      );

      if (!exists) {
        users.push(otherUser);
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getChatUsers,
};