const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const razorpay = require("../config/razorpay");
const PDFDocument = require("pdfkit");

const createOrder = async (req, res) => {
  try {
    console.log("REQ BODY =", req.body);
    console.log("REQ USER =", req.user);

    const { productId,quantity,razorpayOrderId,razorpayPaymentId,paymentStatus, paymentMethod, } = req.body;

    const product = await Product.findById(productId);
    console.log("PRODUCT =", product);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const totalAmount =
      Number(quantity) * Number(product.price);

    const order = await Order.create({
      customerId: req.user._id,
      farmerId: product.farmerId,
      productId,
      quantity,
      totalAmount,

      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId,
    });
    await Notification.create({
      userId: product.farmerId,
      message: `${req.user.name} placed a new order for ${product.title}`,
    });

    res.status(201).json(order);

  } catch (error) {

     console.log("CREATE ORDER ERROR =");
  console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      farmerId: req.user._id,
    })
      .populate("customerId", "name mobile")
      .populate("productId", "title");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getMyOrders = async (req, res) => {
  try {
    console.log("REQ USER =", req.user);
    const orders = await Order.find({
      customerId: req.user._id,
    })
      .populate("productId", "title price")
      .populate("farmerId", "name mobile");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (req.body.status === "Accepted") {

      const product = await Product.findById(
        order.productId
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (product.quantity < order.quantity) {
        return res.status(400).json({
          message: "Not enough stock available",
        });
      }

      product.quantity =
        product.quantity - order.quantity;

      if (product.quantity === 0) {
        product.status = "Out Of Stock";
      }

      await product.save();
    }

    order.status = req.body.status;

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({
      farmerId: req.user._id,
    });

    const pendingOrders = await Order.countDocuments({
      farmerId: req.user._id,
      status: "Pending",
    });

    const acceptedOrders = await Order.countDocuments({
      farmerId: req.user._id,
      status: "Accepted",
    });

    const rejectedOrders = await Order.countDocuments({
      farmerId: req.user._id,
      status: "Rejected",
    });

    res.json({
      totalOrders,
      pendingOrders,
      acceptedOrders,
      rejectedOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getRevenueStats = async (req, res) => {
  try {
    const acceptedOrders = await Order.find({
      farmerId: req.user._id,
      status: "Accepted",
    });

    const totalRevenue = acceptedOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.json({
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const createPaymentOrder = async (
  req,
  res
) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt:
        "receipt_" + Date.now(),
    };

    const order =
      await razorpay.orders.create(
        options
      );

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customerId")
      .populate("farmerId")
      .populate("productId");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(22).text("FROM FARM", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(18).text("Invoice");

    doc.moveDown();

    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);

    doc.moveDown();

    doc.text(`Customer: ${order.customerId.name}`);
    doc.text(`Mobile: ${order.customerId.mobile}`);

    doc.moveDown();

    doc.text(`Farmer: ${order.farmerId.name}`);

    doc.moveDown();

    doc.text(`Product: ${order.productId.title}`);
    doc.text(`Quantity: ${order.quantity}`);
    doc.text(`Price: ₹${order.productId.price}`);
    doc.text(`Total Amount: ₹${order.totalAmount}`);

    doc.moveDown();

    doc.text(`Payment Status: ${order.paymentStatus}`);
    doc.text(`Order Status: ${order.status}`);

    doc.moveDown(2);

    doc.text("Thank you for shopping with From Farm ❤️", {
      align: "center",
    });

    doc.end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createOrder,
  getFarmerOrders,
  updateOrderStatus,
  getMyOrders,
  getOrderStats,
  getRevenueStats,
  createPaymentOrder,
  generateInvoice,
};