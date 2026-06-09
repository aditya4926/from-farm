const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      default: "Active",
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        name: String,

        rating: Number,

        comment: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Product", productSchema);