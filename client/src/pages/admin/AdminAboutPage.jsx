import { useEffect, useRef, useState } from "react";

import AdminMediaField from "../../components/admin/AdminMediaField";
import http from "../../api/http";

const emptyAbout = {
  key: "main",
  eyebrow: "",
  title: "",
  introduction: "",
  story: [],
  profileImage: {
    url: "",
    publicId: "",
    alt: "",
  },
  skillGroups: [],
  experience: [],
  stats: [],
  seo: {
    title: "",
    description: "",
  },
};

const extractData = (response) =>
  response.data?.data ||
  response.data?.content ||
  response.data;

const sortByOrder = (items = []) =>
  [...items].sort(
    (first, second) =>
      (first.order ?? 0) - (second.order ?? 0)
  );

const mergeAboutData = (data = {}) => ({
  ...emptyAbout,
  ...data,

  profileImage: {
    ...emptyAbout.profileImage,
    ...data.profileImage,
  },

  story: Array.isArray(data.story) ? data.story : [],
  skillGroups: sortByOrder(data.skillGroups),
  experience: sortByOrder(data.experience),
  stats: sortByOrder(data.stats),

  seo: {
    ...emptyAbout.seo,
    ...data.seo,
  },
});

const AdminAboutPage = () => {
  const originalPublicId = useRef("");

  const [form, setForm] = useState(emptyAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let active = true;

    const loadAbout = async () => {
      try {
        setLoading(true);

        const response = await http.get("/content/about");
        const aboutData = mergeAboutData(extractData(response));

        if (!active) return;

        setForm(aboutData);
        originalPublicId.current =
          aboutData.profileImage?.publicId || "";
      } catch (error) {
        if (!active) return;

        setFeedback({
          type: "error",
          message:
            error.response?.data?.message ||
            "Hakkımda içeriği alınamadı.",
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAbout();

    return () => {
      active = false;
    };
  }, []);

  const updateRootField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFeedback(null);
  };

  const updateSeoField = (field, value) => {
    setForm((current) => ({
      ...current,
      seo: {
        ...current.seo,
        [field]: value,
      },
    }));

    setFeedback(null);
  };

  const updateArrayItem = (section, index, field, value) => {
    setForm((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));

    setFeedback(null);
  };

  const addArrayItem = (section, newItem) => {
    setForm((current) => ({
      ...current,
      [section]: [
        ...current[section],
        {
          ...newItem,
          order: current[section].length,
        },
      ],
    }));
  };

  const removeArrayItem = (section, index) => {
    setForm((current) => ({
      ...current,
      [section]: current[section]
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,
          order: itemIndex,
        })),
    }));
  };

  const moveArrayItem = (section, index, direction) => {
    setForm((current) => {
      const targetIndex = index + direction;

      if (
        targetIndex < 0 ||
        targetIndex >= current[section].length
      ) {
        return current;
      }

      const items = [...current[section]];

      [items[index], items[targetIndex]] = [
        items[targetIndex],
        items[index],
      ];

      return {
        ...current,
        [section]: items.map((item, itemIndex) => ({
          ...item,
          order: itemIndex,
        })),
      };
    });
  };

  const updateStory = (index, value) => {
    setForm((current) => ({
      ...current,
      story: current.story.map((paragraph, paragraphIndex) =>
        paragraphIndex === index ? value : paragraph
      ),
    }));
  };

  const addStoryParagraph = () => {
    setForm((current) => ({
      ...current,
      story: [...current.story, ""],
    }));
  };

  const removeStoryParagraph = (index) => {
    setForm((current) => ({
      ...current,
      story: current.story.filter(
        (_, paragraphIndex) => paragraphIndex !== index
      ),
    }));
  };

  const moveStoryParagraph = (index, direction) => {
    setForm((current) => {
      const targetIndex = index + direction;

      if (
        targetIndex < 0 ||
        targetIndex >= current.story.length
      ) {
        return current;
      }

      const story = [...current.story];

      [story[index], story[targetIndex]] = [
        story[targetIndex],
        story[index],
      ];

      return {
        ...current,
        story,
      };
    });
  };

  const validateForm = () => {
    const invalidSkillGroup = form.skillGroups.some(
      (group) => !group.title?.trim()
    );

    if (invalidSkillGroup) {
      return "Her yetenek grubunun bir başlığı olmalı.";
    }

    const invalidExperience = form.experience.some(
      (item) => !item.company?.trim() || !item.role?.trim()
    );

    if (invalidExperience) {
      return "Her deneyim kaydında şirket ve pozisyon bulunmalı.";
    }

    const invalidStat = form.stats.some(
      (stat) => !stat.value?.trim() || !stat.label?.trim()
    );

    if (invalidStat) {
      return "Her istatistikte değer ve açıklama bulunmalı.";
    }

    return null;
  };

  const preparePayload = () => ({
    ...form,

    story: form.story
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),

    profileImage: {
      url: form.profileImage?.url || "",
      publicId: form.profileImage?.publicId || "",
      alt: form.profileImage?.alt?.trim() || "",
    },

    skillGroups: form.skillGroups.map((group, index) => ({
      ...group,
      title: group.title.trim(),
      items: (group.items || [])
        .map((item) => item.trim())
        .filter(Boolean),
      order: index,
    })),

    experience: form.experience.map((item, index) => ({
      ...item,
      company: item.company.trim(),
      role: item.role.trim(),
      description: item.description?.trim() || "",
      startDate: item.startDate?.trim() || "",
      endDate: item.isCurrent
        ? ""
        : item.endDate?.trim() || "",
      order: index,
    })),

    stats: form.stats.map((stat, index) => ({
      ...stat,
      value: stat.value.trim(),
      label: stat.label.trim(),
      order: index,
    })),
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

      const previousPublicId = originalPublicId.current;
      const payload = preparePayload();

      const response = await http.put("/content/about", payload);
      const savedAbout = mergeAboutData(extractData(response));

      setForm(savedAbout);

      const currentPublicId =
        savedAbout.profileImage?.publicId || "";

      originalPublicId.current = currentPublicId;

      let cleanupWarning = false;

      if (
        previousPublicId &&
        previousPublicId !== currentPublicId
      ) {
        try {
          await http.delete("/admin/media", {
            data: {
              publicId: previousPublicId,
            },
          });
        } catch {
          cleanupWarning = true;
        }
      }

      setFeedback({
        type: cleanupWarning ? "warning" : "success",
        message: cleanupWarning
          ? "İçerik kaydedildi fakat eski profil görseli medya arşivinden silinemedi."
          : "Hakkımda içeriği başarıyla kaydedildi.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Hakkımda içeriği kaydedilemedi.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="admin-page-state">
        <span>Hakkımda içeriği yükleniyor...</span>
      </section>
    );
  }

  return (
    <div className="admin-editor">
      <header className="admin-editor-header">
        <div>
          <span className="admin-editor-eyebrow">
            İçerik yönetimi
          </span>

          <h1>Hakkımda</h1>

          <p>
            Profil bilgilerini, yeteneklerini ve deneyimlerini tek
            ekrandan yönet.
          </p>
        </div>

        <button
          className="admin-primary-button"
          type="submit"
          form="admin-about-form"
          disabled={saving}
        >
          {saving ? "Kaydediliyor..." : "Değişiklikleri kaydet"}
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

      <form
        id="admin-about-form"
        className="admin-editor-form"
        onSubmit={handleSubmit}
      >
        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>01</span>

            <div>
              <h2>Sayfa başlangıcı</h2>
              <p>Hakkımda sayfasının ana başlığı ve giriş metni.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Üst etiket</span>
              <input
                type="text"
                value={form.eyebrow}
                onChange={(event) =>
                  updateRootField("eyebrow", event.target.value)
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Ana başlık</span>
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  updateRootField("title", event.target.value)
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Giriş açıklaması</span>
              <textarea
                rows="5"
                value={form.introduction}
                onChange={(event) =>
                  updateRootField(
                    "introduction",
                    event.target.value
                  )
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>02</span>

            <div>
              <h2>Profil görseli</h2>
              <p>Hakkımda sayfasındaki 4:5 portre alanı.</p>
            </div>
          </div>

          <AdminMediaField
            label="Portre görseli"
            folder="about"
            showCaption={false}
            value={form.profileImage}
            onChange={(media) =>
              updateRootField("profileImage", {
                url: media.url || "",
                publicId: media.publicId || "",
                alt: media.alt || "",
              })
            }
          />
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>03</span>

            <div>
              <h2>Hikâye</h2>
              <p>
                Her kayıt public sayfada ayrı bir paragraf olur.
              </p>
            </div>
          </div>

          <div className="admin-repeatable-list">
            {form.story.map((paragraph, index) => (
              <article
                className="admin-repeatable-item"
                key={`story-${index}`}
              >
                <div className="admin-repeatable-item__heading">
                  <strong>Paragraf {index + 1}</strong>

                  <div className="admin-repeatable-actions">
                    <button
                      type="button"
                      disabled={index === 0}
                      aria-label="Paragrafı yukarı taşı"
                      onClick={() =>
                        moveStoryParagraph(index, -1)
                      }
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={index === form.story.length - 1}
                      aria-label="Paragrafı aşağı taşı"
                      onClick={() =>
                        moveStoryParagraph(index, 1)
                      }
                    >
                      ↓
                    </button>

                    <button
                      className="is-danger"
                      type="button"
                      onClick={() =>
                        removeStoryParagraph(index)
                      }
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <label className="admin-form-field">
                  <span>Paragraf</span>
                  <textarea
                    rows="5"
                    value={paragraph}
                    onChange={(event) =>
                      updateStory(index, event.target.value)
                    }
                  />
                </label>
              </article>
            ))}

            <button
              className="admin-add-button"
              type="button"
              onClick={addStoryParagraph}
            >
              + Yeni paragraf
            </button>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>04</span>

            <div>
              <h2>Yetenek grupları</h2>
              <p>
                Yazılım ve tasarım yeteneklerini gruplar halinde
                yönet.
              </p>
            </div>
          </div>

          <div className="admin-repeatable-list">
            {form.skillGroups.map((group, index) => (
              <article
                className="admin-repeatable-item"
                key={group._id || `skill-group-${index}`}
              >
                <div className="admin-repeatable-item__heading">
                  <strong>Yetenek grubu {index + 1}</strong>

                  <div className="admin-repeatable-actions">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveArrayItem("skillGroups", index, -1)
                      }
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index === form.skillGroups.length - 1
                      }
                      onClick={() =>
                        moveArrayItem("skillGroups", index, 1)
                      }
                    >
                      ↓
                    </button>

                    <button
                      className="is-danger"
                      type="button"
                      onClick={() =>
                        removeArrayItem("skillGroups", index)
                      }
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <label className="admin-form-field">
                  <span>Grup başlığı</span>
                  <input
                    type="text"
                    value={group.title || ""}
                    placeholder="Örneğin: Development"
                    onChange={(event) =>
                      updateArrayItem(
                        "skillGroups",
                        index,
                        "title",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="admin-form-field">
                  <span>Yetenekler</span>
                  <input
                    type="text"
                    value={(group.items || []).join(", ")}
                    placeholder="React, Node.js, MongoDB, WordPress"
                    onChange={(event) =>
                      updateArrayItem(
                        "skillGroups",
                        index,
                        "items",
                        event.target.value.split(",")
                      )
                    }
                  />

                  <small>
                    Yetenekleri virgülle birbirinden ayır.
                  </small>
                </label>
              </article>
            ))}

            <button
              className="admin-add-button"
              type="button"
              onClick={() =>
                addArrayItem("skillGroups", {
                  title: "",
                  items: [],
                })
              }
            >
              + Yeni yetenek grubu
            </button>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>05</span>

            <div>
              <h2>Deneyim</h2>
              <p>Çalışma ve freelance deneyimlerini yönet.</p>
            </div>
          </div>

          <div className="admin-repeatable-list">
            {form.experience.map((item, index) => (
              <article
                className="admin-repeatable-item"
                key={item._id || `experience-${index}`}
              >
                <div className="admin-repeatable-item__heading">
                  <strong>Deneyim {index + 1}</strong>

                  <div className="admin-repeatable-actions">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveArrayItem("experience", index, -1)
                      }
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index === form.experience.length - 1
                      }
                      onClick={() =>
                        moveArrayItem("experience", index, 1)
                      }
                    >
                      ↓
                    </button>

                    <button
                      className="is-danger"
                      type="button"
                      onClick={() =>
                        removeArrayItem("experience", index)
                      }
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <div className="admin-form-grid admin-form-grid--two">
                  <label className="admin-form-field">
                    <span>Şirket / çalışma biçimi</span>
                    <input
                      type="text"
                      value={item.company || ""}
                      placeholder="Freelance"
                      onChange={(event) =>
                        updateArrayItem(
                          "experience",
                          index,
                          "company",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-form-field">
                    <span>Pozisyon</span>
                    <input
                      type="text"
                      value={item.role || ""}
                      placeholder="Full-stack Developer"
                      onChange={(event) =>
                        updateArrayItem(
                          "experience",
                          index,
                          "role",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-form-field">
                    <span>Başlangıç</span>
                    <input
                      type="text"
                      value={item.startDate || ""}
                      placeholder="2023"
                      onChange={(event) =>
                        updateArrayItem(
                          "experience",
                          index,
                          "startDate",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-form-field">
                    <span>Bitiş</span>
                    <input
                      type="text"
                      disabled={item.isCurrent}
                      value={item.endDate || ""}
                      placeholder="2025"
                      onChange={(event) =>
                        updateArrayItem(
                          "experience",
                          index,
                          "endDate",
                          event.target.value
                        )
                      }
                    />
                  </label>
                </div>

                <label className="admin-check-field">
                  <input
                    type="checkbox"
                    checked={Boolean(item.isCurrent)}
                    onChange={(event) =>
                      updateArrayItem(
                        "experience",
                        index,
                        "isCurrent",
                        event.target.checked
                      )
                    }
                  />

                  <span>Bu deneyim hâlâ devam ediyor</span>
                </label>

                <label className="admin-form-field">
                  <span>Açıklama</span>
                  <textarea
                    rows="4"
                    value={item.description || ""}
                    onChange={(event) =>
                      updateArrayItem(
                        "experience",
                        index,
                        "description",
                        event.target.value
                      )
                    }
                  />
                </label>
              </article>
            ))}

            <button
              className="admin-add-button"
              type="button"
              onClick={() =>
                addArrayItem("experience", {
                  company: "",
                  role: "",
                  description: "",
                  startDate: "",
                  endDate: "",
                  isCurrent: false,
                })
              }
            >
              + Yeni deneyim
            </button>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>06</span>

            <div>
              <h2>İstatistikler</h2>
              <p>
                Deneyim yılı, proje sayısı gibi kısa bilgiler.
              </p>
            </div>
          </div>

          <div className="admin-repeatable-list">
            {form.stats.map((stat, index) => (
              <article
                className="admin-repeatable-item"
                key={stat._id || `stat-${index}`}
              >
                <div className="admin-repeatable-item__heading">
                  <strong>İstatistik {index + 1}</strong>

                  <div className="admin-repeatable-actions">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveArrayItem("stats", index, -1)
                      }
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={index === form.stats.length - 1}
                      onClick={() =>
                        moveArrayItem("stats", index, 1)
                      }
                    >
                      ↓
                    </button>

                    <button
                      className="is-danger"
                      type="button"
                      onClick={() =>
                        removeArrayItem("stats", index)
                      }
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <div className="admin-form-grid admin-form-grid--two">
                  <label className="admin-form-field">
                    <span>Değer</span>
                    <input
                      type="text"
                      value={stat.value || ""}
                      placeholder="5+"
                      onChange={(event) =>
                        updateArrayItem(
                          "stats",
                          index,
                          "value",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-form-field">
                    <span>Açıklama</span>
                    <input
                      type="text"
                      value={stat.label || ""}
                      placeholder="Yıllık deneyim"
                      onChange={(event) =>
                        updateArrayItem(
                          "stats",
                          index,
                          "label",
                          event.target.value
                        )
                      }
                    />
                  </label>
                </div>
              </article>
            ))}

            <button
              className="admin-add-button"
              type="button"
              onClick={() =>
                addArrayItem("stats", {
                  value: "",
                  label: "",
                })
              }
            >
              + Yeni istatistik
            </button>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>07</span>

            <div>
              <h2>SEO ayarları</h2>
              <p>
                Hakkımda sayfasının tarayıcı ve arama motoru bilgileri.
              </p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>SEO başlığı</span>
              <input
                type="text"
                maxLength="70"
                value={form.seo.title}
                onChange={(event) =>
                  updateSeoField("title", event.target.value)
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
                  updateSeoField(
                    "description",
                    event.target.value
                  )
                }
              />
              <small>{form.seo.description.length}/170</small>
            </label>
          </div>
        </section>

        <div className="admin-editor-footer">
          <button
            className="admin-primary-button"
            type="submit"
            disabled={saving}
          >
            {saving ? "Kaydediliyor..." : "Değişiklikleri kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAboutPage;