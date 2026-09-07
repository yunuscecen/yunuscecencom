import express from "express";

import {
  deleteMedia,
  uploadMedia,
} from "../controllers/mediaController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  uploadSingleImage,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", uploadSingleImage, uploadMedia);
router.delete("/", deleteMedia);

export default router;