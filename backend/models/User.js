const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["farmer", "customer", "admin"],
      required: true,
    },

    village: String,
    taluka: String,
    district: String,

    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "",
    },
    location: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);