import express from "express";

import {
  getPageContent,
  updatePageContent,
} from "../controllers/pageContentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPageContent);
router.put("/", protect, updatePageContent);

export default router;