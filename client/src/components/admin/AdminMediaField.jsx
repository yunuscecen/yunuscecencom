import { useRef, useState } from "react";

import http from "../../api/http";

const emptyMedia = {
  url: "",
  publicId: "",
  alt: "",
  caption: "",
};

const AdminMediaField = ({
  label,
  value = emptyMedia,
  onChange,
  folder = "general",
  showCaption = true,
}) => {
  const inputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Yalnızca JPG, PNG, WEBP veya AVIF yükleyebilirsin.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Görsel boyutu en fazla 8 MB olabilir.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("image", file);
      formData.append("folder", folder);

      const response = await http.post("/admin/media", formData);

      const uploadedMedia =
        response.data?.data ||
        response.data?.media ||
        response.data;

      const uploadedUrl =
        uploadedMedia.url ||
        uploadedMedia.secureUrl ||
        uploadedMedia.secure_url;

      if (!uploadedUrl || !uploadedMedia.publicId) {
        throw new Error("Sunucudan geçerli medya bilgisi alınamadı.");
      }

      onChange({
        ...emptyMedia,
        ...value,
        url: uploadedUrl,
        publicId: uploadedMedia.publicId,
        alt:
          value.alt ||
          file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Görsel yüklenemedi."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setError("");

    onChange({
      ...emptyMedia,
    });
  };

  return (
    <div className="admin-media-field">
      <div className="admin-media-field__heading">
        <div>
          <span className="admin-field-label">{label}</span>
          <p>JPG, PNG, WEBP veya AVIF · En fazla 8 MB</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          hidden
          onChange={(event) => handleFile(event.target.files?.[0])}
        />

        <button
          className="admin-secondary-button"
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading
            ? "Yükleniyor..."
            : value.url
              ? "Görseli değiştir"
              : "Görsel yükle"}
        </button>
      </div>

      <div className="admin-media-field__preview">
        {value.url ? (
          <img src={value.url} alt={value.alt || "Yüklenen görsel"} />
        ) : (
          <div className="admin-media-field__placeholder">
            <span>Görsel alanı</span>
            <small>Henüz görsel yüklenmedi</small>
          </div>
        )}
      </div>

      <div className="admin-form-grid admin-form-grid--two">
        <label className="admin-form-field">
          <span>Alternatif metin</span>
          <input
            type="text"
            value={value.alt || ""}
            placeholder="Görseli açıklayan kısa metin"
            onChange={(event) =>
              onChange({
                ...value,
                alt: event.target.value,
              })
            }
          />
        </label>

        {showCaption && (
          <label className="admin-form-field">
            <span>Görsel açıklaması</span>
            <input
              type="text"
              value={value.caption || ""}
              placeholder="İsteğe bağlı açıklama"
              onChange={(event) =>
                onChange({
                  ...value,
                  caption: event.target.value,
                })
              }
            />
          </label>
        )}
      </div>

      {value.url && (
        <button
          className="admin-text-button admin-text-button--danger"
          type="button"
          onClick={handleRemove}
        >
          Görseli kaldır
        </button>
      )}

      {error && <p className="admin-inline-error">{error}</p>}

      <p className="admin-field-note">
        Görseli değiştirme veya kaldırma işlemi ana formu kaydettiğinde
        kesinleşir.
      </p>
    </div>
  );
};

export default AdminMediaField;