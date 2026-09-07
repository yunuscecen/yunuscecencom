import express from "express";

import {
  createService,
  deleteService,
  getAdminServiceById,
  getAdminServices,
  updateService,
} from "../controllers/serviceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAdminServices).post(createService);

router
  .route("/:id")
  .get(getAdminServiceById)
  .put(updateService)
  .delete(deleteService);

export default router;