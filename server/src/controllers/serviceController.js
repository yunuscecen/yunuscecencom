import Service from "../models/Service.js";
import asyncHandler from "../utils/asyncHandler.js";
import pickFields from "../utils/pickFields.js";
import validatePayload from "../utils/validatePayload.js";
import { createUniqueSlug } from "../utils/slugify.js";
import {
  serviceCreateSchema,
  serviceUpdateSchema,
} from "../validators/serviceValidators.js";

const serviceFields = [
  "title",
  "slug",
  "type",
  "coverImage",
  "summary",
  "description",
  "deliverables",
  "tools",
  "icon",
  "order",
  "published",
];

export const getPublishedServices = asyncHandler(async (req, res) => {
  const services = await Service.find({
    published: true,
  })
    .sort({
      order: 1,
      createdAt: 1,
    })
    .lean();

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

export const getPublishedServiceBySlug = asyncHandler(
  async (req, res) => {
    const service = await Service.findOne({
      slug: req.params.slug,
      published: true,
    }).lean();

    if (!service) {
      res.status(404);
      throw new Error("Hizmet bulunamadı.");
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  }
);

export const getAdminServices = asyncHandler(async (req, res) => {
  const services = await Service.find()
    .sort({
      order: 1,
      updatedAt: -1,
    })
    .lean();

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

export const getAdminServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).lean();

  if (!service) {
    res.status(404);
    throw new Error("Hizmet bulunamadı.");
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

export const createService = asyncHandler(async (req, res) => {
  const serviceData = validatePayload(
    serviceCreateSchema,
    pickFields(req.body, serviceFields),
    res
  );

  serviceData.slug = await createUniqueSlug(
    Service,
    serviceData.slug || serviceData.title
  );

  const service = await Service.create(serviceData);

  res.status(201).json({
    success: true,
    message: "Hizmet başarıyla oluşturuldu.",
    data: service,
  });
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error("Hizmet bulunamadı.");
  }

  const updates = validatePayload(
    serviceUpdateSchema,
    pickFields(req.body, serviceFields),
    res
  );

  if (
    Object.prototype.hasOwnProperty.call(updates, "slug") &&
    updates.slug !== service.slug
  ) {
    updates.slug = await createUniqueSlug(
      Service,
      updates.slug || updates.title || service.title,
      service._id
    );
  }

  Object.assign(service, updates);

  await service.save();

  res.status(200).json({
    success: true,
    message: "Hizmet başarıyla güncellendi.",
    data: service,
  });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error("Hizmet bulunamadı.");
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    message: "Hizmet kalıcı olarak silindi.",
  });
});