import {
  useRef,
  useState,
} from "react";

import http from "../../api/http";
import AdminMediaField from "./AdminMediaField";

const emptyImage = {
  url: "",
  publicId: "",
  alt: "",
};

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const createAltText = (fileName) =>
  fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();

const AdminGalleryField = ({
  images = [],
  onChange,
}) => {
  const multipleInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const [error, setError] = useState("");

  const updateImage = (index, image) => {
    onChange(
      images.map((currentImage, imageIndex) =>
        imageIndex === index ? image : currentImage
      )
    );
  };

  const removeImage = (index) => {
    onChange(
      images.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
  };

  const moveImage = (index, direction) => {
    const targetIndex = index + direction;

    if (
      targetIndex < 0 ||
      targetIndex >= images.length
    ) {
      return;
    }

    const nextImages = [...images];

    [nextImages[index], nextImages[targetIndex]] = [
      nextImages[targetIndex],
      nextImages[index],
    ];

    onChange(nextImages);
  };

  const handleMultipleFiles = async (fileList) => {
    const files = Array.from(fileList || []);

    if (files.length === 0) {
      return;
    }

    const invalidTypeFile = files.find(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidTypeFile) {
      setError(
        `"${invalidTypeFile.name}" desteklenmeyen bir dosya türüne sahip. Yalnızca JPG, PNG, WEBP veya AVIF yükleyebilirsin.`
      );
      return;
    }

    const oversizedFile = files.find(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (oversizedFile) {
      setError(
        `"${oversizedFile.name}" 8 MB sınırını geçiyor.`
      );
      return;
    }

    const uploadedImages = [];
    let activeFileName = "";

    try {
      setUploading(true);
      setError("");
      setUploadProgress({
        current: 0,
        total: files.length,
      });

      for (
        let index = 0;
        index < files.length;
        index += 1
      ) {
        const file = files[index];

        activeFileName = file.name;

        setUploadProgress({
          current: index + 1,
          total: files.length,
        });

        const formData = new FormData();

        formData.append("image", file);
        formData.append("folder", "projects");

        const response = await http.post(
          "/admin/media",
          formData
        );

        const uploadedMedia =
          response.data?.data ||
          response.data?.media ||
          response.data;

        const uploadedUrl =
          uploadedMedia.url ||
          uploadedMedia.secureUrl ||
          uploadedMedia.secure_url;

        if (
          !uploadedUrl ||
          !uploadedMedia.publicId
        ) {
          throw new Error(
            "Sunucudan geçerli medya bilgisi alınamadı."
          );
        }

        uploadedImages.push({
          url: uploadedUrl,
          publicId: uploadedMedia.publicId,
          alt: createAltText(file.name),
        });
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          `"${activeFileName}" yüklenemedi.`
      );
    } finally {
      if (uploadedImages.length > 0) {
        onChange([
          ...images,
          ...uploadedImages,
        ]);
      }

      setUploading(false);
      setUploadProgress({
        current: 0,
        total: 0,
      });

      if (multipleInputRef.current) {
        multipleInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="admin-gallery-editor">
      <div className="admin-string-list__heading">
        <span className="admin-field-label">
          Proje galerisi
        </span>

        <small>{images.length} görsel</small>
      </div>

      <div className="admin-gallery-editor__bulk-upload">
        <input
          ref={multipleInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          hidden
          onChange={(event) =>
            handleMultipleFiles(event.target.files)
          }
        />

        <button
          className="admin-add-button"
          type="button"
          disabled={uploading}
          onClick={() =>
            multipleInputRef.current?.click()
          }
        >
          {uploading
            ? `Yükleniyor (${uploadProgress.current}/${uploadProgress.total})`
            : "+ Birden fazla görsel seç"}
        </button>

        <p className="admin-field-note">
          Birden fazla JPG, PNG, WEBP veya AVIF
          seçebilirsin. Her görsel en fazla 8 MB
          olabilir.
        </p>

        {error && (
          <p className="admin-inline-error">
            {error}
          </p>
        )}
      </div>

      <div className="admin-gallery-editor__list">
        {images.map((image, index) => (
          <article
            className="admin-gallery-editor__item"
            key={
              image.publicId ||
              image.url ||
              `gallery-image-${index}`
            }
          >
            <div className="admin-repeatable-item__heading">
              <strong>
                Galeri görseli {index + 1}
              </strong>

              <div className="admin-repeatable-actions">
                <button
                  type="button"
                  disabled={index === 0}
                  aria-label="Görseli yukarı taşı"
                  onClick={() =>
                    moveImage(index, -1)
                  }
                >
                  ↑
                </button>

                <button
                  type="button"
                  disabled={
                    index === images.length - 1
                  }
                  aria-label="Görseli aşağı taşı"
                  onClick={() =>
                    moveImage(index, 1)
                  }
                >
                  ↓
                </button>

                <button
                  className="is-danger"
                  type="button"
                  onClick={() =>
                    removeImage(index)
                  }
                >
                  Kaldır
                </button>
              </div>
            </div>

            <AdminMediaField
              label={`Görsel ${index + 1}`}
              folder="projects"
              showCaption={false}
              value={image}
              onChange={(nextImage) =>
                updateImage(index, {
                  url: nextImage.url || "",
                  publicId:
                    nextImage.publicId || "",
                  alt: nextImage.alt || "",
                })
              }
            />
          </article>
        ))}
      </div>

      <button
        className="admin-add-button"
        type="button"
        disabled={uploading}
        onClick={() =>
          onChange([
            ...images,
            { ...emptyImage },
          ])
        }
      >
        + Boş görsel alanı ekle
      </button>

      <p className="admin-field-note">
        Yüklenen görsellerin sırası ve proje bağlantısı,
        projeyi kaydettiğinde kesinleşir.
      </p>
    </div>
  );
};

export default AdminGalleryField;