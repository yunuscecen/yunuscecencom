import express from "express";
import rateLimit from "express-rate-limit";

import {
  getCurrentUser,
  login,
  logout,
  refreshSession,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: "Çok fazla giriş denemesi yapıldı. Daha sonra tekrar deneyin.",
  },
});

router.post("/login", loginLimiter, login);
router.post("/refresh", refreshSession);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);

export default router;