import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";

const app = express();

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://club-management-lilac.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Browser ke bahar requests
      if (!origin) {
        return callback(null, true);
      }

      // Allowed frontend
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS BLOCKED:", origin);

      // CORS error throw mat karo
      return callback(null, false);
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    optionsSuccessStatus: 204,
  }),
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==========================================
// DATABASE
// ==========================================

// Database ko request ke time connect karo
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// ==========================================
// HOME / HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Club Management API is running",
  });
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Backend is healthy",
  });
});

// ==========================================
// AUTH ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

// ==========================================
// MEMBER ROUTES
// ==========================================

app.use("/api/members", memberRoutes);

// ==========================================
// 404
// ==========================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);

  return res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

// ==========================================
// LOCAL DEVELOPMENT ONLY
// ==========================================

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// ==========================================
// VERCEL
// ==========================================

export default app;
