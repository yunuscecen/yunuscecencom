import express from "express";

import {
  getPublishedServiceBySlug,
  getPublishedServices,
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getPublishedServices);
router.get("/:slug", getPublishedServiceBySlug);

export default router;