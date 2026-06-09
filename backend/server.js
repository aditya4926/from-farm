const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin:[
     "http://localhost:5173",
     "https://from-farm-frontend.vercel.app",
    ],
    credentials: true,
  })

);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);
app.get("/", (req, res) => {
  res.send("Farm Connect API Running");
});

app.use( "/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/wishlist", wishlistRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

});




