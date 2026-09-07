const requiredVariables = [
  "MONGODB_URI",
  "CLIENT_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const validateUrl = (name, value) => {
  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error();
    }
  } catch {
    throw new Error(
      `${name} geçerli bir HTTP veya HTTPS adresi olmalıdır.`
    );
  }
};

export const validateEnvironment = () => {
  const missingVariables = requiredVariables.filter(
    (name) => !process.env[name]?.trim()
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Eksik ortam değişkenleri: ${missingVariables.join(", ")}`
    );
  }

  const nodeEnvironment =
    process.env.NODE_ENV || "development";

  if (
    !["development", "test", "production"].includes(
      nodeEnvironment
    )
  ) {
    throw new Error(
      "NODE_ENV development, test veya production olmalıdır."
    );
  }

  const port = Number(process.env.PORT || 5000);

  if (
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error(
      "PORT, 1 ile 65535 arasında bir tam sayı olmalıdır."
    );
  }

  if (
    !/^mongodb(\+srv)?:\/\//i.test(
      process.env.MONGODB_URI
    )
  ) {
    throw new Error(
      "MONGODB_URI geçerli bir MongoDB bağlantısı olmalıdır."
    );
  }

  const accessSecret =
    process.env.JWT_ACCESS_SECRET.trim();

  const refreshSecret =
    process.env.JWT_REFRESH_SECRET.trim();

  if (
    accessSecret.length < 32 ||
    refreshSecret.length < 32
  ) {
    throw new Error(
      "JWT anahtarlarının her biri en az 32 karakter olmalıdır."
    );
  }

  if (accessSecret === refreshSecret) {
    throw new Error(
      "JWT_ACCESS_SECRET ve JWT_REFRESH_SECRET farklı olmalıdır."
    );
  }

  const clientOrigins = process.env.CLIENT_URL
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (clientOrigins.length === 0) {
    throw new Error(
      "En az bir CLIENT_URL adresi tanımlanmalıdır."
    );
  }

  clientOrigins.forEach((origin) => {
    validateUrl("CLIENT_URL", origin);
  });

  ["SITE_URL", "SERVER_URL", "SITEMAP_URL"].forEach(
    (name) => {
      const value = process.env[name]?.trim();

      if (value) {
        validateUrl(name, value);
      }
    }
  );
};