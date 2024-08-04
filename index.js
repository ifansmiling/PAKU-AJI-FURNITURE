const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const db = require("./config/Database.js");
const AdminRoute = require("./routes/AdminRoute.js");
const KategoriRoute = require("./routes/KategoriRoute.js");
const ProdukRoute = require("./routes/ProdukRoute.js");
const SliderRoute = require("./routes/SliderRoute.js");
const AuthRoute = require("./routes/AuthRoute.js");

dotenv.config();

const app = express();

// Direktori untuk menyimpan file upload
const uploadDirCategories = path.join(__dirname, "uploads/categories");
const uploadDirProduks = path.join(__dirname, "uploads/produks");
const uploadDirSliders = path.join(__dirname, "uploads/sliders");

if (!fs.existsSync(uploadDirCategories)) {
  fs.mkdirSync(uploadDirCategories, { recursive: true });
}

if (!fs.existsSync(uploadDirProduks)) {
  fs.mkdirSync(uploadDirProduks, { recursive: true });
}

if (!fs.existsSync(uploadDirSliders)) {
  fs.mkdirSync(uploadDirSliders, { recursive: true });
}

// Database connection and synchronization
// db.authenticate()
//   .then(() => {
//     console.log("Database connected");
//     // Jalankan migrasi otomatis setiap kali server dijalankan
//     db.sync()
//       .then(() => console.log("Database synchronized"))
//       .catch((err) => console.error("Error synchronizing database:", err));
//   })
//   .catch((err) => console.error("Error connecting to database:", err));

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
    },
  })
);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Serve static files for uploads
app.use("/uploads/categories", express.static(uploadDirCategories));
app.use("/uploads/produks", express.static(uploadDirProduks));
app.use("/uploads/sliders", express.static(uploadDirSliders));

// Routes
app.use(AdminRoute);
app.use(KategoriRoute);
app.use(ProdukRoute);
app.use(SliderRoute);
app.use(AuthRoute);

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running...");
});
