import express from "express";

import {
  createProject,
  deleteProject,
  getAdminProjectById,
  getAdminProjects,
  updateProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAdminProjects).post(createProject);

router
  .route("/:id")
  .get(getAdminProjectById)
  .put(updateProject)
  .delete(deleteProject);

export default router;