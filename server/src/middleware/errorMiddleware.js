export const notFound = (req, res, next) => {
  res.status(404);

  next(
    new Error(
      `Endpoint bulunamadı: ${req.originalUrl}`
    )
  );
};

export const errorHandler = (
  error,
  req,
  res,
  next
) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode =
    error.statusCode ||
    (res.statusCode === 200
      ? 500
      : res.statusCode);

  let message =
    error.message || "Sunucu hatası oluştu.";

  if (error.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Gönderilen JSON verisi geçersiz.";
  }

  if (error.name === "MulterError") {
    statusCode = 400;

    message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Görsel en fazla 8 MB olabilir."
        : "Görsel yükleme işlemi geçersiz.";
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Geçersiz kayıt kimliği.";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (error.code === 11000) {
    statusCode = 409;
    message =
      "Bu bilgiyle daha önce bir kayıt oluşturulmuş.";
  }

  const isProduction =
    process.env.NODE_ENV === "production";

  if (statusCode >= 500) {
    console.error(error);

    if (isProduction) {
      message = "Sunucu hatası oluştu.";
    }
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction
      ? {}
      : {
          stack: error.stack,
        }),
  });
};