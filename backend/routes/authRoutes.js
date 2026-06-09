const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  updateProfile,
  uploadProfilePhoto,
} = require("../controllers/authController");
const upload = require(
  "../middleware/uploadMiddleware"
);
const router = express.Router();

router.post("/register",registerUser);
router.post("/login", loginUser);
router.put("/profile",protect,updateProfile);
router.post("/upload-photo",protect,upload.single("image"),uploadProfilePhoto);
module.exports = router;