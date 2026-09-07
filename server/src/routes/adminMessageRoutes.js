import express from "express";

import {
  deleteMessage,
  getAdminMessageById,
  getAdminMessages,
  getAdminMessageStats,
  updateMessageStatus,
} from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAdminMessages);
router.get("/stats", getAdminMessageStats);

router
  .route("/:id")
  .get(getAdminMessageById)
  .patch(updateMessageStatus)
  .delete(deleteMessage);

export default router;