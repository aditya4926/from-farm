const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const User = require("../models/User");

const addProduct = async (req, res) => {
  console.log("REQ USER =", req.user);
  try {
    const {
      title,
      category,
      price,
      quantity,
      unit,
      description,
      image,
    } = req.body;

    const product = await Product.create({
      title,
      category,
      price,
      quantity,
      unit,
      description,
      image,
      farmerId: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("farmerId", "name mobile village taluka district location");

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate(
        "farmerId",
        "name mobile village taluka district location"
      );

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      farmerId: req.user._id,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    product.title = req.body.title || product.title;
    product.category = req.body.category || product.category;
    product.price = req.body.price || product.price;
    product.quantity = req.body.quantity || product.quantity;
    product.unit = req.body.unit || product.unit;
    product.description = req.body.description || product.description;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({
      farmerId: req.user._id,
    });

    const activeProducts = await Product.countDocuments({
      farmerId: req.user._id,
      status: "Active",
    });

    const outOfStock = await Product.countDocuments({
      farmerId: req.user._id,
      quantity: 0,
    });

    res.json({
      totalProducts,
      activeProducts,
      outOfStock,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "from-farm" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await uploadFromBuffer();

    res.json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const alreadyReviewed =
      product.reviews.find(
        (r) =>
          r.user.toString() ===
          req.user._id.toString()
      );

    if (alreadyReviewed) {
      return res.status(400).json({
        message:
          "You already reviewed this product",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.averageRating =
      product.reviews.reduce(
        (acc, item) => acc + item.rating,
        0
      ) / product.reviews.length;

    await product.save();

    res.json({
      message: "Review Added",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  getMyProducts,
  deleteProduct,
  updateProduct,
  getDashboardStats,
  uploadImage,
  addReview,


};