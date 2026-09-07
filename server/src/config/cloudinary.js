import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

let configured = false;

export const configureCloudinary = () => {
  if (configured) {
    return cloudinary;
  }

  const requiredVariables = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]?.trim()
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Eksik Cloudinary değişkenleri: ${missingVariables.join(", ")}`
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;

  return cloudinary;
};

export default cloudinary;