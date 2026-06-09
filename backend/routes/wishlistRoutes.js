const express = require("express");

const {
  addToWishlist,
  getWishlist,
  removeWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addToWishlist);

router.get("/", protect, getWishlist);

router.delete("/:id", protect, removeWishlist);

module.exports = router;