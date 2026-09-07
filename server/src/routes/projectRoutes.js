import express from "express";

import {
  getPublishedProjectBySlug,
  getPublishedProjects,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getPublishedProjects);
router.get("/:slug", getPublishedProjectBySlug);

export default router;