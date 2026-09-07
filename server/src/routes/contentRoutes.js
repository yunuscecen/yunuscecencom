import express from "express";

import {
  getContent,
  updateContent,
} from "../controllers/contentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:type", getContent);
router.put("/:type", protect, updateContent);

export default router;