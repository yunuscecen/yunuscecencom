import multer from "multer";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    const error = new Error(
      "Yalnızca JPG, PNG, WebP ve AVIF görseller yüklenebilir."
    );

    error.statusCode = 415;

    return callback(error);
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 1,
  },
});

export const uploadSingleImage = upload.single("image");