import { configureCloudinary } from "../config/cloudinary.js";

export const uploadImageBuffer = (buffer, folder) => {
  const cloudinary = configureCloudinary();
  const projectFolder = `yunuscecencom/${folder}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        asset_folder: projectFolder,
        public_id_prefix: projectFolder,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export const deleteCloudinaryImage = async (publicId) => {
  const cloudinary = configureCloudinary();

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
};