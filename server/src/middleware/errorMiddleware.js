export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Endpoint bulunamadı: ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = error.message || "Sunucu hatası oluştu.";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "Bu bilgiyle daha önce bir kayıt oluşturulmuş.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};