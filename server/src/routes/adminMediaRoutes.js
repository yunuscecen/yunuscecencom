import express from "express";

import {
  deleteMedia,
  getMedia,
  uploadMedia,
} from "../controllers/mediaController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  uploadSingleImage,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getMedia)
  .post(uploadSingleImage, uploadMedia)
  .delete(deleteMedia);

export default router;