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
      enum: ["farmer", "customer"],
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);