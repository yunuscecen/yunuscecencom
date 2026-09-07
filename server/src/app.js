import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminProjectRoutes from "./routes/adminProjectRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import adminServiceRoutes from "./routes/adminServiceRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminMessageRoutes from "./routes/adminMessageRoutes.js";

import {
  errorHandler,
  notFound,
} from "./middleware/errorMiddleware.js";

const app = express();

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Bu kaynaktan gelen isteğe izin verilmiyor."));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.",
  },
});



app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Yunus Çeçen API çalışıyor.",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admin/projects", adminProjectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/services", adminServiceRoutes);
app.use("/api/admin/messages", adminMessageRoutes);




app.use(notFound);
app.use(errorHandler);

export default app;