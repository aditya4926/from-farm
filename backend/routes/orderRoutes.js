const express = require("express");

const {
  createOrder,
  getFarmerOrders,
  updateOrderStatus,
  getMyOrders,
  getOrderStats,
  getRevenueStats,
  createPaymentOrder,
  generateInvoice,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/farmer", protect, getFarmerOrders);

router.get("/my-orders", protect, getMyOrders);

router.get("/stats",protect,getOrderStats);

router.get("/revenue",protect,getRevenueStats);

router.post("/create-payment-order",protect,createPaymentOrder);

router.get("/invoice/:id", generateInvoice);

router.put("/:id", protect, updateOrderStatus);



module.exports = router;