import AdminMediaField from "./AdminMediaField";

const emptyImage = {
  url: "",
  publicId: "",
  alt: "",
};

const AdminGalleryField = ({
  images = [],
  onChange,
}) => {
  const updateImage = (index, image) => {
    onChange(
      images.map((currentImage, imageIndex) =>
        imageIndex === index ? image : currentImage
      )
    );
  };

  const removeImage = (index) => {
    onChange(
      images.filter((_, imageIndex) => imageIndex !== index)
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

  return (
    <div className="admin-gallery-editor">
      <div className="admin-string-list__heading">
        <span className="admin-field-label">
          Proje galerisi
        </span>

        <small>{images.length} görsel</small>
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
              <strong>Galeri görseli {index + 1}</strong>

              <div className="admin-repeatable-actions">
                <button
                  type="button"
                  disabled={index === 0}
                  aria-label="Görseli yukarı taşı"
                  onClick={() => moveImage(index, -1)}
                >
                  ↑
                </button>

                <button
                  type="button"
                  disabled={index === images.length - 1}
                  aria-label="Görseli aşağı taşı"
                  onClick={() => moveImage(index, 1)}
                >
                  ↓
                </button>

                <button
                  className="is-danger"
                  type="button"
                  onClick={() => removeImage(index)}
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
                  publicId: nextImage.publicId || "",
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
        onClick={() =>
          onChange([...images, { ...emptyImage }])
        }
      >
        + Galeri görseli ekle
      </button>

      <p className="admin-field-note">
        Görsellerin yeni sırası proje kaydedildiğinde
        kesinleşir.
      </p>
    </div>
  );
};

export default AdminGalleryField;