const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      default: "COD",
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },

    razorpayOrderId: {
      type: String,
    },

    razorpayPaymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);