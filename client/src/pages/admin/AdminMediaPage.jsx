import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  ImagePlus,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";

import http from "../../api/http";
import { useConfirm } from "../../context/ConfirmContext";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const formatBytes = (bytes) => {
  if (!bytes) {
    return "—";
  }

  const megabytes = bytes / (1024 * 1024);

  return `${megabytes.toFixed(2)} MB`;
};

const AdminMediaPage = () => {
  const confirm = useConfirm();
  const fileInputRef = useRef(null);

  const [media, setMedia] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [folder, setFolder] = useState("general");

  const [pageStatus, setPageStatus] = useState("loading");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [deletingId, setDeletingId] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [feedback, setFeedback] = useState(null);

  const loadMedia = async (cursor = "", append = false) => {
    try {
      if (!append) {
        setPageStatus("loading");
      }

      const response = await http.get("/admin/media", {
        params: cursor ? { cursor } : {},
      });

      setMedia((current) =>
        append
          ? [...current, ...response.data.data]
          : response.data.data
      );

      setNextCursor(response.data.nextCursor);
      setPageStatus("success");
    } catch (error) {
      setPageStatus("error");

      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Medya dosyaları yüklenemedi.",
      });
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setFeedback(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setFeedback({
        type: "error",
        message:
          "Yalnızca JPG, PNG, WebP veya AVIF yükleyebilirsiniz.",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setFeedback({
        type: "error",
        message: "Görsel en fazla 8 MB olabilir.",
      });

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setFeedback({
        type: "error",
        message: "Önce bir görsel seçin.",
      });

      return;
    }

    setUploadStatus("uploading");
    setFeedback(null);

    const formData = new FormData();

    formData.append("image", selectedFile);
    formData.append("folder", folder);

    try {
      const response = await http.post(
        "/admin/media",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMedia((current) => [
        response.data.data,
        ...current,
      ]);

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setFeedback({
        type: "success",
        message: "Görsel başarıyla yüklendi.",
      });

      setUploadStatus("success");
    } catch (error) {
      setUploadStatus("error");

      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Görsel yüklenemedi.",
      });
    }
  };

  const handleDelete = async (image) => {
    if (!image?.publicId) return;

    const imageName =
      image.publicId.split("/").at(-1) || "Seçilen görsel";

    const confirmed = await confirm({
      title: `${imageName} silinsin mi?`,
      description:
        "Görsel Cloudinary hesabından kalıcı olarak kaldırılacak. Bu işlem geri alınamaz.",
      confirmLabel: "Görseli sil",
      cancelLabel: "Vazgeç",
      tone: "danger",
    });

    if (!confirmed) return;

    try {
      setDeletingId(image.publicId);
      setFeedback(null);

      await http.delete("/admin/media", {
        data: {
          publicId: image.publicId,
        },
      });

      setMedia((current) =>
        current.filter(
          (item) => item.publicId !== image.publicId
        )
      );

      setFeedback({
        type: "success",
        message: "Görsel silindi.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Görsel silinemedi.",
      });
    } finally {
      setDeletingId("");
    }
  };

  const handleCopy = async (image) => {
    try {
      await navigator.clipboard.writeText(image.url);

      setCopiedId(image.publicId);

      window.setTimeout(() => {
        setCopiedId("");
      }, 1500);
    } catch {
      setFeedback({
        type: "error",
        message: "Görsel adresi kopyalanamadı.",
      });
    }
  };

  return (
    <div className="admin-media-page">
      <header className="admin-page-header">
        <div>
          <span>Library / Media</span>
          <h1>Medya</h1>
          <p>
            Site genelinde kullanılacak görselleri yükleyin ve
            yönetin.
          </p>
        </div>
      </header>

      {feedback && (
        <div
          className={`admin-feedback admin-feedback--${feedback.type}`}
          role="status"
        >
          {feedback.message}
        </div>
      )}

      <section className="admin-media-upload">
        <div className="admin-media-upload__preview">
          {previewUrl ? (
            <img src={previewUrl} alt="Yükleme önizlemesi" />
          ) : (
            <div>
              <ImagePlus size={28} />
              <p>Görsel önizlemesi</p>
              <span>JPG, PNG, WebP veya AVIF</span>
            </div>
          )}
        </div>

        <form onSubmit={handleUpload}>
          <div>
            <span>Yeni görsel</span>
            <h2>Medya yükle</h2>
            <p>En fazla 8 MB büyüklüğünde görsel seçin.</p>
          </div>

          <label>
            <span>Klasör</span>

            <select
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
            >
              <option value="general">Genel</option>
              <option value="home">Ana Sayfa</option>
              <option value="about">Hakkımda</option>
              <option value="services">Hizmetler</option>
              <option value="projects">Projeler</option>
            </select>
          </label>

          <label className="admin-file-input">
            <Upload size={17} />
            <span>
              {selectedFile
                ? selectedFile.name
                : "Görsel seç"}
            </span>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.avif"
              onChange={handleFileChange}
            />
          </label>

          <button
            className="admin-primary-button"
            type="submit"
            disabled={
              !selectedFile || uploadStatus === "uploading"
            }
          >
            {uploadStatus === "uploading" ? (
              <>
                <LoaderCircle className="is-spinning" size={17} />
                Yükleniyor
              </>
            ) : (
              <>
                <Upload size={17} />
                Cloudinary’ye yükle
              </>
            )}
          </button>
        </form>
      </section>

      <section className="admin-media-library">
        <header>
          <div>
            <span>Assets</span>
            <h2>Yüklenen görseller</h2>
          </div>

          <strong>{media.length}</strong>
        </header>

        {pageStatus === "loading" && (
          <div className="admin-empty-state">
            <LoaderCircle className="is-spinning" />
            <p>Medya yükleniyor.</p>
          </div>
        )}

        {pageStatus === "error" && (
          <div className="admin-empty-state">
            <p>Medya kütüphanesi yüklenemedi.</p>
          </div>
        )}

        {pageStatus === "success" && media.length === 0 && (
          <div className="admin-empty-state">
            <ImagePlus size={25} />
            <p>Henüz görsel yüklenmedi.</p>
          </div>
        )}

        {pageStatus === "success" && media.length > 0 && (
          <div className="admin-media-grid">
            {media.map((image) => (
              <article
                className="admin-media-card"
                key={image.publicId}
              >
                <div className="admin-media-card__image">
                  <img
                    src={image.url}
                    alt=""
                    loading="lazy"
                  />
                </div>

                <div className="admin-media-card__content">
                  <p title={image.publicId}>
                    {image.publicId.split("/").at(-1)}
                  </p>

                  <span>
                    {image.width} × {image.height} ·{" "}
                    {formatBytes(image.bytes)}
                  </span>

                  <div>
                    <button
                      type="button"
                      onClick={() => handleCopy(image)}
                    >
                      {copiedId === image.publicId ? (
                        <Check size={15} />
                      ) : (
                        <Copy size={15} />
                      )}

                      {copiedId === image.publicId
                        ? "Kopyalandı"
                        : "URL"}
                    </button>

                    <button
                      className="is-danger"
                      type="button"
                      disabled={deletingId === image.publicId}
                      onClick={() => handleDelete(image)}
                    >
                      {deletingId === image.publicId ? (
                        <LoaderCircle
                          className="is-spinning"
                          size={15}
                        />
                      ) : (
                        <Trash2 size={15} />
                      )}

                      Sil
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {nextCursor && (
          <button
            className="admin-load-more"
            type="button"
            onClick={() => loadMedia(nextCursor, true)}
          >
            Daha fazla yükle
          </button>
        )}
      </section>
    </div>
  );
};

export default AdminMediaPage;