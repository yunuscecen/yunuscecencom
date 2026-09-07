import asyncHandler from "../utils/asyncHandler.js";
import {
  deleteCloudinaryImage,
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

  const result = await deleteCloudinaryImage(publicId);

  res.status(200).json({
    success: true,
    message:
      result.result === "not found"
        ? "Görsel daha önce silinmiş."
        : "Görsel başarıyla silindi.",
  });
});