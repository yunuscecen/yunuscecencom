import { v2 as cloudinary } from "cloudinary";

let configured = false;

const getRequiredValue = (key) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} ortam değişkeni tanımlanmamış.`);
  }

  return value;
};

export const configureCloudinary = () => {
  if (configured) {
    return cloudinary;
  }

  cloudinary.config({
    cloud_name: getRequiredValue("CLOUDINARY_CLOUD_NAME"),
    api_key: getRequiredValue("CLOUDINARY_API_KEY"),
    api_secret: getRequiredValue("CLOUDINARY_API_SECRET"),
    secure: true,
  });

  configured = true;

  return cloudinary;
};