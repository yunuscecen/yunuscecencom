export const notFound = (req, res, next) => {
  res.status(404);

  next(new Error(`Endpoint bulunamadı: ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Sunucu hatası oluştu.",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};