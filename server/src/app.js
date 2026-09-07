import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";


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

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Yunus Çeçen API çalışıyor.",
    timestamp: new Date().toISOString(),
  });
});



app.use(notFound);
app.use(errorHandler);

export default app;