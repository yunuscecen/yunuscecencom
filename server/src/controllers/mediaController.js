import About from "../models/About.js";
import HomePage from "../models/HomePage.js";
import Project from "../models/Project.js";
import Service from "../models/Service.js";

import asyncHandler from "../utils/asyncHandler.js";

import {
  deleteCloudinaryImage,
  listCloudinaryImages,
  uploadImageBuffer,
} from "../services/mediaService.js";

const allowedFolders = new Set([
  "home",
  "about",
  "services",
  "projects",
  "general",
]);

const getUploadFolder = (requestedFolder) => {
  if (allowedFolders.has(requestedFolder)) {
    return requestedFolder;
  }

  return "general";
};

const isMediaInUse = async (publicId) => {
  const references = await Promise.all([
    HomePage.exists({
      "featuredMedia.publicId": publicId,
    }),
    About.exists({
      "profileImage.publicId": publicId,
    }),
    Service.exists({
      "coverImage.publicId": publicId,
    }),
    Project.exists({
      $or: [
        {
          "coverImage.publicId": publicId,
        },
        {
          "gallery.publicId": publicId,
        },
      ],
    }),
  ]);

  return references.some(Boolean);
};

export const getMedia = asyncHandler(async (req, res) => {
  const result = await listCloudinaryImages(req.query.cursor);

  const images = result.resources.map((resource) => ({
    url: resource.secure_url,
    publicId: resource.public_id,
    width: resource.width,
    height: resource.height,
    format: resource.format,
    bytes: resource.bytes,
    createdAt: resource.created_at,
  }));

  res.status(200).json({
    success: true,
    data: images,
    nextCursor: result.next_cursor || null,
  });
});

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Yüklenecek görsel bulunamadı.");
  }

  const folder = getUploadFolder(req.body.folder);

  const result = await uploadImageBuffer(
    req.file.buffer,
    folder
  );

  res.status(201).json({
    success: true,
    message: "Görsel başarıyla yüklendi.",
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      createdAt: result.created_at,
    },
  });
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const { publicId } = req.body;

  if (!publicId || typeof publicId !== "string") {
    res.status(400);
    throw new Error("Silinecek görselin publicId bilgisi gerekli.");
  }

  if (!publicId.startsWith("yunuscecencom/")) {
    res.status(403);
    throw new Error("Bu görsel bu projeye ait değil.");
  }

  if (await isMediaInUse(publicId)) {
    res.status(409);

    throw new Error(
      "Bu görsel sitede kullanılıyor. Önce bağlı olduğu içerikten kaldırın."
    );
  }

  const result = await deleteCloudinaryImage(publicId);

  res.status(200).json({
    success: true,
    message:
      result.result === "not found"
        ? "Görsel daha önce silinmiş."
        : "Görsel başarıyla silindi.",
  });
});