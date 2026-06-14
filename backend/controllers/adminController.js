const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalFarmers = await User.countDocuments({
      role: "farmer",
    });

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (sum, order) =>
        sum + (order.totalAmount || 0),
      0
    );

    res.json({
      totalUsers,
      totalFarmers,
      totalCustomers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUser,
};