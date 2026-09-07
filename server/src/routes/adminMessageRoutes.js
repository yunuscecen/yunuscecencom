import express from "express";

import {
  deleteMessage,
  getAdminMessageById,
  getAdminMessages,
  updateMessageStatus,
} from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAdminMessages);

router
  .route("/:id")
  .get(getAdminMessageById)
  .patch(updateMessageStatus)
  .delete(deleteMessage);

export default router;