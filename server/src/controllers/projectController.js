import Project from "../models/Project.js";
import asyncHandler from "../utils/asyncHandler.js";
import pickFields from "../utils/pickFields.js";
import validatePayload from "../utils/validatePayload.js";
import { createUniqueSlug } from "../utils/slugify.js";
import {
  projectCreateSchema,
  projectUpdateSchema,
} from "../validators/projectValidators.js";

const projectFields = [
  "title",
  "slug",
  "category",
  "shortDescription",
  "description",
  "coverImage",
  "gallery",
  "technologies",
  "services",
  "client",
  "year",
  "challenge",
  "solution",
  "results",
  "links",
  "featured",
  "published",
  "order",
  "seo",
];

const getProjectLimit = (value) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue)) {
    return 12;
  }

  return Math.min(Math.max(parsedValue, 1), 50);
};

export const getPublishedProjects = asyncHandler(async (req, res) => {
  const filter = {
    published: true,
  };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.featured === "true") {
    filter.featured = true;
  }

  if (req.query.featured === "false") {
    filter.featured = false;
  }

  const projects = await Project.find(filter)
    .select(
      [
        "title",
        "slug",
        "category",
        "shortDescription",
        "coverImage",
        "technologies",
        "services",
        "client",
        "year",
        "featured",
        "order",
        "createdAt",
      ].join(" ")
    )
    .sort({
      featured: -1,
      order: 1,
      createdAt: -1,
    })
    .limit(getProjectLimit(req.query.limit))
    .lean();

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

export const getPublishedProjectBySlug = asyncHandler(
  async (req, res) => {
    const project = await Project.findOne({
      slug: req.params.slug,
      published: true,
    }).lean();

    if (!project) {
      res.status(404);
      throw new Error("Proje bulunamadı.");
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  }
);

export const getAdminProjects = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status === "published") {
    filter.published = true;
  }

  if (req.query.status === "draft") {
    filter.published = false;
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const projects = await Project.find(filter)
    .sort({
      updatedAt: -1,
    })
    .lean();

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

export const getAdminProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).lean();

  if (!project) {
    res.status(404);
    throw new Error("Proje bulunamadı.");
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

export const createProject = asyncHandler(async (req, res) => {
  const projectData = validatePayload(
    projectCreateSchema,
    pickFields(req.body, projectFields),
    res
  );

  const requestedSlug = projectData.slug || projectData.title;

  projectData.slug = await createUniqueSlug(
    Project,
    requestedSlug
  );

  const project = await Project.create(projectData);

  res.status(201).json({
    success: true,
    message: "Proje başarıyla oluşturuldu.",
    data: project,
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Proje bulunamadı.");
  }

  const updates = validatePayload(
    projectUpdateSchema,
    pickFields(req.body, projectFields),
    res
  );

  if (
    Object.prototype.hasOwnProperty.call(updates, "slug") &&
    updates.slug !== project.slug
  ) {
    updates.slug = await createUniqueSlug(
      Project,
      updates.slug || updates.title || project.title,
      project._id
    );
  }

  Object.assign(project, updates);

  await project.save();

  res.status(200).json({
    success: true,
    message: "Proje başarıyla güncellendi.",
    data: project,
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Proje bulunamadı.");
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Proje kalıcı olarak silindi.",
  });
});