const express = require("express");

const { addProduct, getProducts, getProductById,getMyProducts,deleteProduct,updateProduct,getDashboardStats,uploadImage,addReview, } = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
router.get("/", getProducts);

router.get("/my-products", protect, getMyProducts);
router.get("/dashboard/stats",protect,getDashboardStats);
router.get("/:id", getProductById);
router.post("/", protect, addProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.post("/upload",protect,upload.single("image"),uploadImage);
router.post("/:id/review",protect, addReview);

module.exports = router; 