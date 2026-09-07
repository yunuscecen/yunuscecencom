import express from "express";
import rateLimit from "express-rate-limit";

import {
  createContactMessage,
} from "../controllers/contactController.js";

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Çok fazla mesaj gönderildi. Lütfen daha sonra tekrar deneyin.",
  },
});

router.post("/", contactLimiter, createContactMessage);

export default router;