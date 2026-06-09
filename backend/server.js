const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

dotenv.config();
console.log("ENV Cloud:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("ENV Mongo:", process.env.MONGO_URI);
connectDB();

const app = express();
const path = require("path");
app.use(cors());
app.use(express.json());
app.use(
  "/api/auth",
  authRoutes
);
app.use("/api/products", productRoutes);
app.get("/", (req, res) => {
  res.send("Farm Connect API Running");
});


const PORT = process.env.PORT || 5000;
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);
app.listen(PORT, () => {

});



app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  "/api/notifications",
  notificationRoutes
);
app.use("/api/wishlist", wishlistRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/orders", orderRoutes);
