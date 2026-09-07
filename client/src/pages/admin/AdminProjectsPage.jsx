import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import AdminGalleryField from "../../components/admin/AdminGalleryField";
import AdminMediaField from "../../components/admin/AdminMediaField";
import AdminStringListField from "../../components/admin/AdminStringListField";
import { useConfirm } from "../../context/ConfirmContext";
import http from "../../api/http";
import useUnsavedChanges from "../../hooks/useUnsavedChanges";

const categoryLabels = {
  "web-development": "Web Development",
  wordpress: "WordPress",
  "ui-ux": "UI / UX",
  "graphic-design": "Graphic Design",
  branding: "Branding",
  other: "Diğer",
};

const emptyProject = {
  title: "",
  slug: "",
  category: "web-development",
  shortDescription: "",
  description: [],
  coverImage: {
    url: "",
    publicId: "",
    alt: "",
  },
  gallery: [],
  technologies: [],
  services: [],
  client: "",
  year: "",
  challenge: "",
  solution: "",
  results: [],
  links: {
    live: "",
    github: "",
    behance: "",
  },
  featured: false,
  published: false,
  order: 0,
  seo: {
    title: "",
    description: "",
  },
};

const extractData = (response) =>
  response.data?.data || response.data;

const extractProjects = (response) => {
  const data = extractData(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.projects)) return data.projects;

  return [];
};

const extractProject = (response) => {
  const data = extractData(response);

  return data?.project || data;
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

const normalizeProject = (project = {}) => ({
  ...emptyProject,
  ...project,

  coverImage: {
    ...emptyProject.coverImage,
    ...project.coverImage,
  },

  gallery: Array.isArray(project.gallery)
    ? project.gallery
    : [],

  description: Array.isArray(project.description)
    ? project.description
    : [],

  technologies: Array.isArray(project.technologies)
    ? project.technologies
    : [],

  services: Array.isArray(project.services)
    ? project.services
    : [],

  results: Array.isArray(project.results)
    ? project.results
    : [],

  links: {
    ...emptyProject.links,
    ...project.links,
  },

  seo: {
    ...emptyProject.seo,
    ...project.seo,
  },
});

const getMediaIds = (project) =>
  [
    project.coverImage?.publicId,
    ...(project.gallery || []).map(
      (image) => image.publicId
    ),
  ].filter(Boolean);

const deleteMediaIds = async (publicIds) => {
  if (publicIds.length === 0) return false;

  const uniqueIds = [...new Set(publicIds)];

  const results = await Promise.allSettled(
    uniqueIds.map((publicId) =>
      http.delete("/admin/media", {
        data: {
          publicId,
        },
      })
    )
  );

  return results.some(
    (result) => result.status === "rejected"
  );
};

const AdminProjectsPage = () => {
  const confirm = useConfirm();
  const originalMediaIds = useRef([]);

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(() =>
    structuredClone(emptyProject)
  );
  const [savedForm, setSavedForm] = useState(() =>
    structuredClone(emptyProject)
  );
  const [editingId, setEditingId] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  

  const [filters, setFilters] = useState({
    status: "",
    category: "",
    search: "",
  });

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
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);

      const response = await http.get("/admin/projects", {
        params: {
          ...(filters.status && {
            status: filters.status,
          }),

          ...(filters.category && {
            category: filters.category,
          }),
        },
      });

      setProjects(extractProjects(response));
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Projeler alınamadı.",
      });
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.category]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const visibleProjects = projects.filter((project) =>
    project.title
      .toLocaleLowerCase("tr-TR")
      .includes(
        filters.search
          .trim()
          .toLocaleLowerCase("tr-TR")
      )
  );

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFeedback(null);
  };

  const updateNestedField = (
    section,
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));

    setFeedback(null);
  };

  const resetEditor = () => {
    const nextForm = structuredClone(emptyProject);

    setEditorOpen(false);
    setEditingId(null);
    setSlugTouched(false);
    setForm(nextForm);
    setSavedForm(structuredClone(nextForm));
    originalMediaIds.current = [];
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
        "Projede yaptığın kaydedilmemiş değişiklikler kaybolacak.",
      confirmLabel: "Değişiklikleri sil",
      cancelLabel: "Düzenlemeye devam et",
      tone: "danger",
    });
  };

  const openCreateEditor = async () => {
    const canContinue = await confirmEditorChange();

    if (!canContinue) return;

    const nextForm = {
      ...structuredClone(emptyProject),
      order: projects.length,
    };

    setForm(nextForm);
    setSavedForm(structuredClone(nextForm));

    originalMediaIds.current = [];

    setEditingId(null);
    setSlugTouched(false);
    setEditorOpen(true);
    setFeedback(null);
  };

  const openEditEditor = async (project) => {
    const canContinue = await confirmEditorChange();

    if (!canContinue) return;

    const normalizedProject = normalizeProject(project);

    setForm(structuredClone(normalizedProject));
    setSavedForm(structuredClone(normalizedProject));
    setEditingId(project._id);
    setSlugTouched(true);
    setEditorOpen(true);
    setFeedback(null);

    originalMediaIds.current =
      getMediaIds(normalizedProject);
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
      slug: slugTouched
        ? current.slug
        : slugify(value),
    }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Proje başlığı zorunludur.";
    }

    if (!form.slug.trim()) {
      return "Proje slug alanı zorunludur.";
    }

    if (!form.shortDescription.trim()) {
      return "Kısa proje açıklaması zorunludur.";
    }

    if (form.shortDescription.trim().length > 300) {
      return "Kısa açıklama en fazla 300 karakter olabilir.";
    }

    if (!form.coverImage?.url) {
      return "Projenin bir kapak görseli olmalıdır.";
    }

    if (!form.coverImage?.alt?.trim()) {
      return "Kapak görselinin alternatif metni olmalıdır.";
    }

    const invalidGalleryImage = form.gallery.some(
      (image) =>
        image.url && !image.alt?.trim()
    );

    if (invalidGalleryImage) {
      return "Galerideki her görselin alternatif metni olmalıdır.";
    }

    return null;
  };

  const preparePayload = () => ({
    ...form,

    title: form.title.trim(),
    slug: slugify(form.slug),
    shortDescription:
      form.shortDescription.trim(),

    description: form.description
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),

    coverImage: {
      url: form.coverImage.url,
      publicId: form.coverImage.publicId || "",
      alt: form.coverImage.alt.trim(),
    },

    gallery: form.gallery
      .filter(
        (image) =>
          image.url && image.alt?.trim()
      )
      .map((image) => ({
        url: image.url,
        publicId: image.publicId || "",
        alt: image.alt.trim(),
      })),

    technologies: form.technologies
      .map((technology) => technology.trim())
      .filter(Boolean),

    services: form.services
      .map((service) => service.trim())
      .filter(Boolean),

    client: form.client.trim(),
    year: form.year.trim(),
    challenge: form.challenge.trim(),
    solution: form.solution.trim(),

    results: form.results
      .map((result) => result.trim())
      .filter(Boolean),

    links: {
      live: form.links.live.trim(),
      github: form.links.github.trim(),
      behance: form.links.behance.trim(),
    },

    order: Number(form.order) || 0,

    seo: {
      title: form.seo.title.trim(),
      description: form.seo.description.trim(),
    },
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
            `/admin/projects/${editingId}`,
            payload
          )
        : await http.post(
            "/admin/projects",
            payload
          );

      const savedProject = normalizeProject(
        extractProject(response)
      );

      const currentMediaIds =
        getMediaIds(savedProject);

      const removedMediaIds = editingId
        ? originalMediaIds.current.filter(
            (publicId) =>
              !currentMediaIds.includes(publicId)
          )
        : [];

      const cleanupWarning =
        await deleteMediaIds(removedMediaIds);

      await loadProjects();
      resetEditor();

      setFeedback({
        type: cleanupWarning ? "warning" : "success",
        message: cleanupWarning
          ? "Proje kaydedildi fakat kaldırılan bazı görseller medya arşivinden silinemedi."
          : editingId
            ? "Proje başarıyla güncellendi."
            : "Yeni proje başarıyla oluşturuldu.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Proje kaydedilemedi.",
      });
    } finally {
      setSaving(false);
    }
  };
const handleDelete = async (project) => {
  if (!project?._id) return;

  const confirmed = await confirm({
    title: `“${project.title}” silinsin mi?`,
    description:
      "Proje, kapak görseli ve galeri görselleri kalıcı olarak kaldırılacak. Bu işlem geri alınamaz.",
    confirmLabel: "Projeyi sil",
    cancelLabel: "Vazgeç",
    tone: "danger",
  });

  if (!confirmed) {
    return;
  }

  try {
    setDeletingId(project._id);
    setFeedback(null);

    const projectMediaIds = getMediaIds(project);

    await http.delete(
      `/admin/projects/${project._id}`
    );

    const cleanupWarning =
      await deleteMediaIds(projectMediaIds);

    if (editingId === project._id) {
      resetEditor();
    }

    await loadProjects();

    setFeedback({
      type: cleanupWarning ? "warning" : "success",
      message: cleanupWarning
        ? "Proje silindi fakat bazı görseller medya arşivinden silinemedi."
        : "Proje ve bağlı görseller başarıyla silindi.",
    });
  } catch (error) {
    setFeedback({
      type: "error",
      message:
        error.response?.data?.message ||
        "Proje silinemedi.",
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
            Portfolio yönetimi
          </span>

          <h1>Projeler</h1>

          <p>
            Proje içeriklerini, kapaklarını, galerilerini ve
            yayın durumlarını yönet.
          </p>
        </div>

        <button
          className="admin-primary-button"
          type="button"
          onClick={openCreateEditor}
        >
          + Yeni proje
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

      <div className="admin-project-toolbar">
        <input
          type="search"
          placeholder="Projelerde ara..."
          value={filters.search}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              search: event.target.value,
            }))
          }
        />

        <select
          value={filters.status}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              status: event.target.value,
            }))
          }
        >
          <option value="">Tüm durumlar</option>
          <option value="published">Yayında</option>
          <option value="draft">Taslak</option>
        </select>

        <select
          value={filters.category}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              category: event.target.value,
            }))
          }
        >
          <option value="">Tüm kategoriler</option>

          {Object.entries(categoryLabels).map(
            ([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            )
          )}
        </select>
      </div>

      <div className="admin-content-layout">
        <section className="admin-list-panel">
          <div className="admin-list-panel__heading">
            <div>
              <h2>Proje listesi</h2>
              <p>{visibleProjects.length} kayıt</p>
            </div>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              Projeler yükleniyor...
            </div>
          ) : visibleProjects.length === 0 ? (
            <div className="admin-empty-state">
              <strong>Proje bulunamadı.</strong>
              <p>Yeni bir proje oluşturabilirsin.</p>
            </div>
          ) : (
            <div className="admin-record-list">
              {visibleProjects.map((project) => (
                <article
                  className={`admin-record-card ${
                    editingId === project._id
                      ? "is-selected"
                      : ""
                  }`}
                  key={project._id}
                >
                  <div className="admin-record-card__media">
                    <img
                      src={project.coverImage?.url}
                      alt={project.coverImage?.alt || ""}
                    />
                  </div>

                  <div className="admin-record-card__content">
                    <div className="admin-record-card__meta">
                      <span>
                        {categoryLabels[project.category]}
                      </span>

                      <span
                        className={
                          project.published
                            ? "is-published"
                            : "is-draft"
                        }
                      >
                        {project.published
                          ? "Yayında"
                          : "Taslak"}
                      </span>
                    </div>

                    <h3>{project.title}</h3>
                    <p>{project.shortDescription}</p>

                    <div className="admin-project-badges">
                      {project.featured && (
                        <span>Öne çıkan</span>
                      )}

                      {project.year && (
                        <span>{project.year}</span>
                      )}

                      <span>
                        {project.gallery?.length || 0} görsel
                      </span>
                    </div>

                    <div className="admin-record-card__footer">
                      <small>Sıra: {project.order ?? 0}</small>

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            openEditEditor(project)
                          }
                        >
                          Düzenle
                        </button>

                                                <button
                          className="is-danger"
                          type="button"
                          disabled={
                            deletingId === project._id
                          }
                          onClick={() =>
                            handleDelete(project)
                          }
                        >
                          {deletingId === project._id
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
                    ? "Projeyi düzenle"
                    : "Yeni proje"}
                </span>

                <h2>
                  {form.title || "Yeni proje oluştur"}
                </h2>
              </div>

              <button
                className="admin-editor-close"
                type="button"
                onClick={closeEditor}
                aria-label="Editörü kapat"
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
                  <span>Proje başlığı</span>
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
                    onChange={(event) => {
                      setSlugTouched(true);
                      updateField(
                        "slug",
                        slugify(event.target.value)
                      );
                    }}
                  />
                </label>

                <label className="admin-form-field">
                  <span>Kategori</span>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      updateField(
                        "category",
                        event.target.value
                      )
                    }
                  >
                    {Object.entries(categoryLabels).map(
                      ([value, label]) => (
                        <option value={value} key={value}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label className="admin-form-field">
                  <span>Sıralama</span>
                  <input
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={(event) =>
                      updateField(
                        "order",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>

              <label className="admin-form-field">
                <span>Kısa açıklama</span>
                <textarea
                  rows="4"
                  maxLength="300"
                  value={form.shortDescription}
                  onChange={(event) =>
                    updateField(
                      "shortDescription",
                      event.target.value
                    )
                  }
                />
                <small>
                  {form.shortDescription.length}/300
                </small>
              </label>

              <AdminStringListField
                label="Proje paragrafı"
                addLabel="Yeni paragraf"
                multiline
                items={form.description}
                onChange={(items) =>
                  updateField("description", items)
                }
              />

              <AdminMediaField
                label="Kapak görseli"
                folder="projects"
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

              <AdminGalleryField
                images={form.gallery}
                onChange={(images) =>
                  updateField("gallery", images)
                }
              />

              <div className="admin-form-grid admin-form-grid--two">
                <label className="admin-form-field">
                  <span>Müşteri</span>
                  <input
                    type="text"
                    value={form.client}
                    onChange={(event) =>
                      updateField(
                        "client",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="admin-form-field">
                  <span>Yıl</span>
                  <input
                    type="text"
                    value={form.year}
                    placeholder="2026"
                    onChange={(event) =>
                      updateField(
                        "year",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>

              <label className="admin-form-field">
                <span>Teknolojiler</span>
                <input
                  type="text"
                  value={form.technologies.join(", ")}
                  placeholder="React, Node.js, MongoDB"
                  onChange={(event) =>
                    updateField(
                      "technologies",
                      event.target.value.split(",")
                    )
                  }
                />
                <small>Virgülle birbirinden ayır.</small>
              </label>

              <label className="admin-form-field">
                <span>Sunulan hizmetler</span>
                <input
                  type="text"
                  value={form.services.join(", ")}
                  placeholder="UI/UX, Frontend, Backend"
                  onChange={(event) =>
                    updateField(
                      "services",
                      event.target.value.split(",")
                    )
                  }
                />
                <small>Virgülle birbirinden ayır.</small>
              </label>

              <label className="admin-form-field">
                <span>Problem / ihtiyaç</span>
                <textarea
                  rows="5"
                  value={form.challenge}
                  onChange={(event) =>
                    updateField(
                      "challenge",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="admin-form-field">
                <span>Çözüm / yaklaşım</span>
                <textarea
                  rows="5"
                  value={form.solution}
                  onChange={(event) =>
                    updateField(
                      "solution",
                      event.target.value
                    )
                  }
                />
              </label>

              <AdminStringListField
                label="Sonuç"
                addLabel="Yeni sonuç"
                items={form.results}
                onChange={(items) =>
                  updateField("results", items)
                }
              />

              <div className="admin-form-grid">
                <label className="admin-form-field">
                  <span>Canlı proje URL’si</span>
                  <input
                    type="url"
                    value={form.links.live}
                    onChange={(event) =>
                      updateNestedField(
                        "links",
                        "live",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="admin-form-field">
                  <span>GitHub URL’si</span>
                  <input
                    type="url"
                    value={form.links.github}
                    onChange={(event) =>
                      updateNestedField(
                        "links",
                        "github",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="admin-form-field">
                  <span>Behance URL’si</span>
                  <input
                    type="url"
                    value={form.links.behance}
                    onChange={(event) =>
                      updateNestedField(
                        "links",
                        "behance",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>

              <div className="admin-checkbox-row">
                <label className="admin-check-field">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      updateField(
                        "featured",
                        event.target.checked
                      )
                    }
                  />
                  <span>Ana sayfada öne çıkar</span>
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
                  <span>Projeyi yayınla</span>
                </label>
              </div>

              <div className="admin-form-grid">
                <label className="admin-form-field">
                  <span>SEO başlığı</span>
                  <input
                    type="text"
                    maxLength="70"
                    value={form.seo.title}
                    onChange={(event) =>
                      updateNestedField(
                        "seo",
                        "title",
                        event.target.value
                      )
                    }
                  />
                  <small>{form.seo.title.length}/70</small>
                </label>

                <label className="admin-form-field">
                  <span>SEO açıklaması</span>
                  <textarea
                    rows="4"
                    maxLength="170"
                    value={form.seo.description}
                    onChange={(event) =>
                      updateNestedField(
                        "seo",
                        "description",
                        event.target.value
                      )
                    }
                  />
                  <small>
                    {form.seo.description.length}/170
                  </small>
                </label>
              </div>

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
                      ? "Projeyi güncelle"
                      : "Projeyi oluştur"}
                </button>
              </div>
            </form>
          </section>
        ) : (
          <aside className="admin-editor-placeholder">
            <span>Project editor</span>
            <h2>Bir proje seç veya yeni proje oluştur.</h2>
            <p>
              Projenin tüm detayları burada açılır.
            </p>
          </aside>
        )}
      </div>

    
    </div>
  );
};

export default AdminProjectsPage;