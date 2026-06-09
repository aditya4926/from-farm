const Wishlist = require("../models/Wishlist");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const exists = await Wishlist.findOne({
      userId: req.user._id,
      productId,
    });

    if (exists) {
      return res.status(400).json({
        message: "Already in wishlist",
      });
    }

    const item = await Wishlist.create({
      userId: req.user._id,
      productId,
    });

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({
      userId: req.user._id,
    }).populate("productId");

    res.json(items);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeWishlist = async (req, res) => {
  try {

    await Wishlist.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Removed",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeWishlist,
};