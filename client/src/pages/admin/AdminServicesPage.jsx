import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminMediaField from "../../components/admin/AdminMediaField";
import http from "../../api/http";
import { useConfirm } from "../../context/ConfirmContext";
import useUnsavedChanges from "../../hooks/useUnsavedChanges";
const emptyService = {
  title: "",
  slug: "",
  type: "development",
  summary: "",
  description: "",
  coverImage: {
    url: "",
    publicId: "",
    alt: "",
  },
  deliverables: [],
  tools: [],
  icon: "",
  published: true,
  order: 0,
};

const extractData = (response) =>
  response.data?.data || response.data;

const extractServices = (response) => {
  const data = extractData(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.services)) return data.services;

  return [];
};

const extractService = (response) => {
  const data = extractData(response);

  return data?.service || data;
};

const slugify = (value) =>
  value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeService = (service = {}) => ({
  ...emptyService,
  ...service,

  coverImage: {
    ...emptyService.coverImage,
    ...service.coverImage,
  },

  deliverables: Array.isArray(service.deliverables)
    ? service.deliverables
    : [],

  tools: Array.isArray(service.tools)
    ? service.tools
    : [],
});

const AdminServicesPage = () => {
const confirm = useConfirm();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(() =>
    structuredClone(emptyService)
  );
  const [savedForm, setSavedForm] = useState(() =>
    structuredClone(emptyService)
  );
  const [editingId, setEditingId] = useState(null);
  const [originalPublicId, setOriginalPublicId] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [feedback, setFeedback] = useState(null);
    const hasUnsavedChanges = useMemo(
    () =>
      JSON.stringify(form) !== JSON.stringify(savedForm),
    [form, savedForm]
  );

  useUnsavedChanges(
    editorOpen && hasUnsavedChanges && !saving
  );
  const loadServices = async () => {
    try {
      setLoading(true);

      const response = await http.get("/admin/services");

      setServices(
        extractServices(response).sort(
          (first, second) =>
            (first.order ?? 0) - (second.order ?? 0)
        )
      );
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Hizmetler alınamadı.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFeedback(null);
  };

  const resetEditor = () => {
    const nextForm = structuredClone(emptyService);

    setEditorOpen(false);
    setEditingId(null);
    setOriginalPublicId("");
    setSlugTouched(false);
    setForm(nextForm);
    setSavedForm(structuredClone(nextForm));
  };

  const confirmEditorChange = async () => {
    if (
      !editorOpen ||
      !hasUnsavedChanges ||
      saving
    ) {
      return true;
    }

    return confirm({
      title: "Kaydedilmemiş değişiklikler silinsin mi?",
      description:
        "Hizmette yaptığın kaydedilmemiş değişiklikler kaybolacak.",
      confirmLabel: "Değişiklikleri sil",
      cancelLabel: "Düzenlemeye devam et",
      tone: "danger",
    });
  };

  const openCreateEditor = async () => {
    const canContinue = await confirmEditorChange();

    if (!canContinue) return;

    const nextForm = {
      ...structuredClone(emptyService),
      order: services.length,
    };

    setForm(nextForm);
    setSavedForm(structuredClone(nextForm));

    setEditingId(null);
    setOriginalPublicId("");
    setSlugTouched(false);
    setEditorOpen(true);
    setFeedback(null);
  };

  const openEditEditor = async (service) => {
    const canContinue = await confirmEditorChange();

    if (!canContinue) return;

    const normalizedService = normalizeService(service);

    setForm(structuredClone(normalizedService));
    setSavedForm(structuredClone(normalizedService));
    setEditingId(service._id);
    setOriginalPublicId(
      normalizedService.coverImage?.publicId || ""
    );
    setSlugTouched(true);
    setEditorOpen(true);
    setFeedback(null);
  };

  const closeEditor = async () => {
    const canClose = await confirmEditorChange();

    if (!canClose) return;

    resetEditor();
  };

  const handleTitleChange = (value) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Hizmet başlığı boş bırakılamaz.";
    }

    if (!form.slug.trim()) {
      return "Hizmet bağlantı adı boş bırakılamaz.";
    }

    if (!form.summary.trim()) {
      return "Hizmet özeti boş bırakılamaz.";
    }

    if (form.summary.trim().length > 300) {
      return "Hizmet özeti en fazla 300 karakter olabilir.";
    }

    return null;
  };

  const preparePayload = () => ({
    ...form,
    title: form.title.trim(),
    slug: slugify(form.slug),
    summary: form.summary.trim(),
    description: form.description.trim(),

    coverImage: {
      url: form.coverImage?.url || "",
      publicId: form.coverImage?.publicId || "",
      alt: form.coverImage?.alt?.trim() || "",
    },

    deliverables: form.deliverables
      .map((item) => item.trim())
      .filter(Boolean),

    tools: form.tools
      .map((item) => item.trim())
      .filter(Boolean),

    icon: form.icon.trim(),
    order: Number(form.order) || 0,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFeedback({
        type: "error",
        message: validationError,
      });

      return;
    }

    try {
      setSaving(true);
      setFeedback(null);

      const payload = preparePayload();

      const response = editingId
        ? await http.put(
            `/admin/services/${editingId}`,
            payload
          )
        : await http.post("/admin/services", payload);

      const savedService = normalizeService(
        extractService(response)
      );

      const newPublicId =
        savedService.coverImage?.publicId ||
        payload.coverImage.publicId ||
        "";

      let cleanupWarning = false;

      if (
        editingId &&
        originalPublicId &&
        originalPublicId !== newPublicId
      ) {
        try {
          await http.delete("/admin/media", {
            data: {
              publicId: originalPublicId,
            },
          });
        } catch {
          cleanupWarning = true;
        }
      }

      await loadServices();
      resetEditor();

      setFeedback({
        type: cleanupWarning ? "warning" : "success",
        message: cleanupWarning
          ? "Hizmet kaydedildi fakat eski kapak görseli medya arşivinden silinemedi."
          : editingId
            ? "Hizmet başarıyla güncellendi."
            : "Yeni hizmet başarıyla oluşturuldu.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Hizmet kaydedilemedi.",
      });
    } finally {
      setSaving(false);
    }
  };

const handleDelete = async (service) => {
  if (!service?._id) return;

  const confirmed = await confirm({
    title: `“${service.title}” silinsin mi?`,
    description:
      "Hizmet ve ona bağlı kapak görseli kalıcı olarak kaldırılacak. Bu işlem geri alınamaz.",
    confirmLabel: "Hizmeti sil",
    cancelLabel: "Vazgeç",
    tone: "danger",
  });

  if (!confirmed) {
    return;
  }

  try {
    setDeletingId(service._id);
    setFeedback(null);

    const deletedPublicId =
      service.coverImage?.publicId || "";

    await http.delete(
      `/admin/services/${service._id}`
    );

    let cleanupWarning = false;

    if (deletedPublicId) {
      try {
        await http.delete("/admin/media", {
          data: {
            publicId: deletedPublicId,
          },
        });
      } catch {
        cleanupWarning = true;
      }
    }

    if (editingId === service._id) {
      resetEditor();
    }

    await loadServices();

    setFeedback({
      type: cleanupWarning ? "warning" : "success",
      message: cleanupWarning
        ? "Hizmet silindi fakat kapak görseli medya arşivinden silinemedi."
        : "Hizmet başarıyla silindi.",
    });
  } catch (error) {
    setFeedback({
      type: "error",
      message:
        error.response?.data?.message ||
        "Hizmet silinemedi.",
    });
  } finally {
    setDeletingId("");
  }
};
  return (
    <div className="admin-editor">
      <header className="admin-editor-header">
        <div>
          <span className="admin-editor-eyebrow">
            İçerik yönetimi
          </span>

          <h1>Hizmetler</h1>

          <p>
            Yazılım ve tasarım hizmetlerini, görsellerini ve
            yayın durumlarını yönet.
          </p>
        </div>

        <button
          className="admin-primary-button"
          type="button"
          onClick={openCreateEditor}
        >
          + Yeni hizmet
        </button>
      </header>

      {feedback && (
        <div
          className={`admin-feedback admin-feedback--${feedback.type}`}
          role="status"
        >
          {feedback.message}
        </div>
      )}

      <div
        className={`admin-content-layout ${
          editorOpen ? "has-editor" : ""
        }`}
      >
        <section className="admin-list-panel">
          <div className="admin-list-panel__heading">
            <div>
              <h2>Hizmet listesi</h2>
              <p>{services.length} kayıt</p>
            </div>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              Hizmetler yükleniyor...
            </div>
          ) : services.length === 0 ? (
            <div className="admin-empty-state">
              <strong>Henüz hizmet bulunmuyor.</strong>
              <p>İlk hizmetini oluşturabilirsin.</p>
            </div>
          ) : (
            <div className="admin-record-list">
              {services.map((service) => (
                <article
                  className={`admin-record-card ${
                    editingId === service._id
                      ? "is-selected"
                      : ""
                  }`}
                  key={service._id}
                >
                  <div className="admin-record-card__media">
                    {service.coverImage?.url ? (
                      <img
                        src={service.coverImage.url}
                        alt={service.coverImage.alt || ""}
                      />
                    ) : (
                      <div
                        className={`admin-service-placeholder admin-service-placeholder--${service.type}`}
                      >
                        <span>
                          {service.icon ||
                            (service.type === "design"
                              ? "DES"
                              : "DEV")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="admin-record-card__content">
                    <div className="admin-record-card__meta">
                      <span>
                        {service.type === "design"
                          ? "Tasarım"
                          : "Yazılım"}
                      </span>

                      <span
                        className={
                          service.published
                            ? "is-published"
                            : "is-draft"
                        }
                      >
                        {service.published
                          ? "Yayında"
                          : "Taslak"}
                      </span>
                    </div>

                    <h3>{service.title}</h3>
                    <p>{service.summary}</p>

                    <div className="admin-record-card__footer">
                      <small>Sıra: {service.order ?? 0}</small>

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            openEditEditor(service)
                          }
                        >
                          Düzenle
                        </button>

                       <button
  className="is-danger"
  type="button"
  disabled={deletingId === service._id}
  onClick={() => handleDelete(service)}
>
  {deletingId === service._id
    ? "Siliniyor..."
    : "Sil"}
</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {editorOpen ? (
          <section className="admin-editor-card admin-record-editor">
            <div className="admin-record-editor__heading">
              <div>
                <span>
                  {editingId
                    ? "Hizmeti düzenle"
                    : "Yeni hizmet"}
                </span>

                <h2>
                  {editingId
                    ? form.title || "İsimsiz hizmet"
                    : "Yeni kayıt oluştur"}
                </h2>
              </div>

              <button
                className="admin-editor-close"
                type="button"
                aria-label="Editörü kapat"
                onClick={closeEditor}
              >
                ×
              </button>
            </div>

            <form
              className="admin-form-grid"
              onSubmit={handleSubmit}
            >
              <div className="admin-form-grid admin-form-grid--two">
                <label className="admin-form-field">
                  <span>Hizmet başlığı</span>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      handleTitleChange(event.target.value)
                    }
                  />
                </label>

                <label className="admin-form-field">
                  <span>Slug</span>
                  <input
                    type="text"
                    value={form.slug}
                    placeholder="web-gelistirme"
                    onChange={(event) => {
                      setSlugTouched(true);
                      updateField(
                        "slug",
                        slugify(event.target.value)
                      );
                    }}
                  />
                </label>
              </div>

              <div className="admin-form-grid admin-form-grid--two">
                <label className="admin-form-field">
                  <span>Hizmet türü</span>

                  <select
                    value={form.type}
                    onChange={(event) =>
                      updateField("type", event.target.value)
                    }
                  >
                    <option value="development">
                      Yazılım geliştirme
                    </option>
                    <option value="design">
                      Grafik / UI tasarım
                    </option>
                  </select>
                </label>

                <label className="admin-form-field">
                  <span>Sıralama</span>
                  <input
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={(event) =>
                      updateField("order", event.target.value)
                    }
                  />
                </label>
              </div>

              <label className="admin-form-field">
                <span>Kısa özet</span>
                <textarea
                  rows="4"
                  maxLength="300"
                  value={form.summary}
                  onChange={(event) =>
                    updateField(
                      "summary",
                      event.target.value
                    )
                  }
                />
                <small>{form.summary.length}/300</small>
              </label>

              <label className="admin-form-field">
                <span>Detaylı açıklama</span>
                <textarea
                  rows="8"
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                />
              </label>

              <AdminMediaField
                label="Hizmet kapak görseli"
                folder="services"
                showCaption={false}
                value={form.coverImage}
                onChange={(media) =>
                  updateField("coverImage", {
                    url: media.url || "",
                    publicId: media.publicId || "",
                    alt: media.alt || "",
                  })
                }
              />

              <label className="admin-form-field">
                <span>Teslim edilecekler</span>
                <input
                  type="text"
                  value={form.deliverables.join(", ")}
                  placeholder="Kaynak kodlar, Yönetim paneli, Dokümantasyon"
                  onChange={(event) =>
                    updateField(
                      "deliverables",
                      event.target.value.split(",")
                    )
                  }
                />
                <small>Öğeleri virgülle birbirinden ayır.</small>
              </label>

              <label className="admin-form-field">
                <span>Kullanılan araçlar</span>
                <input
                  type="text"
                  value={form.tools.join(", ")}
                  placeholder="React, Node.js, MongoDB, Figma"
                  onChange={(event) =>
                    updateField(
                      "tools",
                      event.target.value.split(",")
                    )
                  }
                />
                <small>Öğeleri virgülle birbirinden ayır.</small>
              </label>

              <label className="admin-form-field">
                <span>İkon etiketi</span>
                <input
                  type="text"
                  value={form.icon}
                  placeholder="DEV, UI veya kodda kullanılan ikon adı"
                  onChange={(event) =>
                    updateField("icon", event.target.value)
                  }
                />
              </label>

              <label className="admin-check-field">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(event) =>
                    updateField(
                      "published",
                      event.target.checked
                    )
                  }
                />
                <span>Bu hizmeti sitede yayınla</span>
              </label>

              <div className="admin-form-actions">
                <button
                  className="admin-secondary-button"
                  type="button"
                  onClick={closeEditor}
                >
                  Vazgeç
                </button>

                <button
                  className="admin-primary-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Kaydediliyor..."
                    : editingId
                      ? "Hizmeti güncelle"
                      : "Hizmeti oluştur"}
                </button>
              </div>
            </form>
          </section>
        ) : (
          <aside className="admin-editor-placeholder">
            <span>Service editor</span>
            <h2>Bir hizmet seç veya yeni hizmet oluştur.</h2>
            <p>
              Seçtiğin hizmetin tüm alanları burada açılır.
            </p>
          </aside>
        )}
      </div>

    </div>
  );
};

export default AdminServicesPage;