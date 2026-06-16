
const express = require("express");

const {
  getAdminStats,
  getAllUsers,
  deleteUser,
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
router.delete("/users/:id", protect, adminOnly, deleteUser);


module.exports = router;