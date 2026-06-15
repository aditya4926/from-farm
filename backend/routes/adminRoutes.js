
const express = require("express");

const {
  getAdminStats,
  getAllUsers,
  getAllProducts,
  deleteProductByAdmin,
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
router.get("/products", protect, adminOnly, getAllProducts);

router.delete("/products/:id", protect, adminOnly, deleteProductByAdmin);


module.exports = router;