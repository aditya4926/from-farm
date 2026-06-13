
const express = require("express");

const {
  getAdminStats,
  getAllUsers,
} = require("../controllers/adminController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  adminOnly,
} = require("../middleware/adminMiddleware");



const router = express.Router();


router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/users", protect, adminOnly, getAllUsers);


module.exports = router;