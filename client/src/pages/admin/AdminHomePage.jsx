import { useEffect, useRef, useState } from "react";

import AdminMediaField from "../../components/admin/AdminMediaField";
import http from "../../api/http";

const defaultHome = {
  hero: {
    eyebrow: "",
    title: "",
    highlightedText: "",
    description: "",
    primaryCta: {
      label: "",
      href: "",
    },
    secondaryCta: {
      label: "",
      href: "",
    },
  },
  featuredMedia: {
    url: "",
    publicId: "",
    alt: "",
    caption: "",
  },
  projectsIntro: {
    eyebrow: "",
    title: "",
    description: "",
  },
  servicesIntro: {
    eyebrow: "",
    title: "",
    description: "",
  },
  processIntro: {
    eyebrow: "",
    title: "",
    description: "",
  },
  processSteps: [],
  aboutPreview: {
    eyebrow: "",
    title: "",
    description: "",
  },
  contactCta: {
    eyebrow: "",
    title: "",
    description: "",
    buttonLabel: "",
    buttonHref: "",
  },
  seo: {
    title: "",
    description: "",
  },
};

const mergeHomeData = (data = {}) => ({
  ...defaultHome,
  ...data,

  hero: {
    ...defaultHome.hero,
    ...data.hero,
    primaryCta: {
      ...defaultHome.hero.primaryCta,
      ...data.hero?.primaryCta,
    },
    secondaryCta: {
      ...defaultHome.hero.secondaryCta,
      ...data.hero?.secondaryCta,
    },
  },

  featuredMedia: {
    ...defaultHome.featuredMedia,
    ...data.featuredMedia,
  },

  projectsIntro: {
    ...defaultHome.projectsIntro,
    ...data.projectsIntro,
  },

  servicesIntro: {
    ...defaultHome.servicesIntro,
    ...data.servicesIntro,
  },

  processIntro: {
    ...defaultHome.processIntro,
    ...data.processIntro,
  },

  processSteps: Array.isArray(data.processSteps)
    ? data.processSteps
    : [],

  aboutPreview: {
    ...defaultHome.aboutPreview,
    ...data.aboutPreview,
  },

  contactCta: {
    ...defaultHome.contactCta,
    ...data.contactCta,
  },

  seo: {
    ...defaultHome.seo,
    ...data.seo,
  },
});

const extractResponseData = (response) =>
  response.data?.data ||
  response.data?.content ||
  response.data;

const AdminHomePage = () => {
  const originalPublicId = useRef("");

  const [form, setForm] = useState(defaultHome);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let active = true;

    const loadHome = async () => {
      try {
        setLoading(true);

        const response = await http.get("/content/home");
        const homeData = mergeHomeData(extractResponseData(response));

        if (!active) return;

        setForm(homeData);
        originalPublicId.current =
          homeData.featuredMedia?.publicId || "";
      } catch (error) {
        if (!active) return;

        setFeedback({
          type: "error",
          message:
            error.response?.data?.message ||
            "Ana sayfa içeriği alınamadı.",
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadHome();

    return () => {
      active = false;
    };
  }, []);

  const updateField = (path, value) => {
    setForm((currentForm) => {
      const keys = path.split(".");
      const nextForm = { ...currentForm };

      let cursor = nextForm;
      let currentCursor = currentForm;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          cursor[key] = value;
          return;
        }

        cursor[key] = {
          ...(currentCursor?.[key] || {}),
        };

        cursor = cursor[key];
        currentCursor = currentCursor?.[key];
      });

      return nextForm;
    });

    setFeedback(null);
  };

  const updateProcessStep = (index, field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      processSteps: currentForm.processSteps.map((step, stepIndex) =>
        stepIndex === index
          ? {
              ...step,
              [field]: value,
            }
          : step
      ),
    }));

    setFeedback(null);
  };

  const addProcessStep = () => {
    setForm((currentForm) => ({
      ...currentForm,
      processSteps: [
        ...currentForm.processSteps,
        {
          number: String(currentForm.processSteps.length + 1).padStart(
            2,
            "0"
          ),
          title: "",
          description: "",
          order: currentForm.processSteps.length,
        },
      ],
    }));
  };

  const removeProcessStep = (index) => {
    setForm((currentForm) => ({
      ...currentForm,
      processSteps: currentForm.processSteps
        .filter((_, stepIndex) => stepIndex !== index)
        .map((step, stepIndex) => ({
          ...step,
          order: stepIndex,
        })),
    }));
  };

  const moveProcessStep = (index, direction) => {
    setForm((currentForm) => {
      const targetIndex = index + direction;

      if (
        targetIndex < 0 ||
        targetIndex >= currentForm.processSteps.length
      ) {
        return currentForm;
      }

      const steps = [...currentForm.processSteps];

      [steps[index], steps[targetIndex]] = [
        steps[targetIndex],
        steps[index],
      ];

      return {
        ...currentForm,
        processSteps: steps.map((step, stepIndex) => ({
          ...step,
          order: stepIndex,
        })),
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setFeedback(null);

      const previousPublicId = originalPublicId.current;

      const response = await http.put("/content/home", form);
      const savedHome = mergeHomeData(extractResponseData(response));

      setForm(savedHome);

      const currentPublicId =
        savedHome.featuredMedia?.publicId || "";

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
          ? "İçerik kaydedildi fakat önceki görsel medya arşivinden silinemedi. Görsel başka bir alanda kullanılıyor olabilir."
          : "Ana sayfa içeriği başarıyla kaydedildi.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Ana sayfa içeriği kaydedilemedi.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="admin-page-state">
        <span>İçerik yükleniyor...</span>
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
          <h1>Ana sayfa</h1>
          <p>
            Ana sayfadaki metinleri, bağlantıları ve görsel alanını
            buradan yönetebilirsin.
          </p>
        </div>

        <button
          className="admin-primary-button"
          type="submit"
          form="admin-home-form"
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
        id="admin-home-form"
        className="admin-editor-form"
        onSubmit={handleSubmit}
      >
        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>01</span>

            <div>
              <h2>Açılış alanı</h2>
              <p>
                Ziyaretçinin ilk gördüğü başlık, açıklama ve butonlar.
              </p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Üst etiket</span>
              <input
                type="text"
                value={form.hero.eyebrow}
                onChange={(event) =>
                  updateField("hero.eyebrow", event.target.value)
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Ana başlık</span>
              <input
                type="text"
                value={form.hero.title}
                onChange={(event) =>
                  updateField("hero.title", event.target.value)
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Vurgulanan metin</span>
              <input
                type="text"
                value={form.hero.highlightedText}
                onChange={(event) =>
                  updateField(
                    "hero.highlightedText",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Açıklama</span>
              <textarea
                rows="5"
                value={form.hero.description}
                onChange={(event) =>
                  updateField("hero.description", event.target.value)
                }
              />
            </label>

            <div className="admin-form-grid admin-form-grid--two">
              <label className="admin-form-field">
                <span>Birinci buton metni</span>
                <input
                  type="text"
                  value={form.hero.primaryCta.label}
                  onChange={(event) =>
                    updateField(
                      "hero.primaryCta.label",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="admin-form-field">
                <span>Birinci buton bağlantısı</span>
                <input
                  type="text"
                  value={form.hero.primaryCta.href}
                  placeholder="/projeler"
                  onChange={(event) =>
                    updateField(
                      "hero.primaryCta.href",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="admin-form-field">
                <span>İkinci buton metni</span>
                <input
                  type="text"
                  value={form.hero.secondaryCta.label}
                  onChange={(event) =>
                    updateField(
                      "hero.secondaryCta.label",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="admin-form-field">
                <span>İkinci buton bağlantısı</span>
                <input
                  type="text"
                  value={form.hero.secondaryCta.href}
                  placeholder="/iletisim"
                  onChange={(event) =>
                    updateField(
                      "hero.secondaryCta.href",
                      event.target.value
                    )
                  }
                />
              </label>
            </div>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>02</span>

            <div>
              <h2>Ana sayfa görseli</h2>
              <p>
                Ana sayfadaki geniş görsel alanını yönetir.
              </p>
            </div>
          </div>

          <AdminMediaField
            label="Öne çıkan görsel"
            folder="home"
            value={form.featuredMedia}
            onChange={(media) =>
              updateField("featuredMedia", media)
            }
          />
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>03</span>

            <div>
              <h2>Projeler bölümü</h2>
              <p>Öne çıkan projelerin üzerindeki giriş metni.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Üst etiket</span>
              <input
                type="text"
                value={form.projectsIntro.eyebrow}
                onChange={(event) =>
                  updateField(
                    "projectsIntro.eyebrow",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Başlık</span>
              <input
                type="text"
                value={form.projectsIntro.title}
                onChange={(event) =>
                  updateField(
                    "projectsIntro.title",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Açıklama</span>
              <textarea
                rows="4"
                value={form.projectsIntro.description}
                onChange={(event) =>
                  updateField(
                    "projectsIntro.description",
                    event.target.value
                  )
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>04</span>

            <div>
              <h2>Hizmetler bölümü</h2>
              <p>Hizmet kartlarının üzerindeki giriş metni.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Üst etiket</span>
              <input
                type="text"
                value={form.servicesIntro.eyebrow}
                onChange={(event) =>
                  updateField(
                    "servicesIntro.eyebrow",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Başlık</span>
              <input
                type="text"
                value={form.servicesIntro.title}
                onChange={(event) =>
                  updateField(
                    "servicesIntro.title",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Açıklama</span>
              <textarea
                rows="4"
                value={form.servicesIntro.description}
                onChange={(event) =>
                  updateField(
                    "servicesIntro.description",
                    event.target.value
                  )
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>05</span>

            <div>
              <h2>Çalışma süreci</h2>
              <p>
                Süreç bölümünün başlığı ve sıralanabilir adımları.
              </p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Üst etiket</span>
              <input
                type="text"
                value={form.processIntro.eyebrow}
                onChange={(event) =>
                  updateField(
                    "processIntro.eyebrow",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Başlık</span>
              <input
                type="text"
                value={form.processIntro.title}
                onChange={(event) =>
                  updateField(
                    "processIntro.title",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Açıklama</span>
              <textarea
                rows="4"
                value={form.processIntro.description}
                onChange={(event) =>
                  updateField(
                    "processIntro.description",
                    event.target.value
                  )
                }
              />
            </label>
          </div>

          <div className="admin-repeatable-list">
            {form.processSteps.map((step, index) => (
              <article
                className="admin-repeatable-item"
                key={step._id || `process-step-${index}`}
              >
                <div className="admin-repeatable-item__heading">
                  <strong>Süreç adımı {index + 1}</strong>

                  <div className="admin-repeatable-actions">
                    <button
                      type="button"
                      aria-label="Yukarı taşı"
                      disabled={index === 0}
                      onClick={() => moveProcessStep(index, -1)}
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      aria-label="Aşağı taşı"
                      disabled={
                        index === form.processSteps.length - 1
                      }
                      onClick={() => moveProcessStep(index, 1)}
                    >
                      ↓
                    </button>

                    <button
                      className="is-danger"
                      type="button"
                      onClick={() => removeProcessStep(index)}
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <div className="admin-form-grid admin-form-grid--two">
                  <label className="admin-form-field">
                    <span>Numara</span>
                    <input
                      type="text"
                      value={step.number || ""}
                      onChange={(event) =>
                        updateProcessStep(
                          index,
                          "number",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-form-field">
                    <span>Başlık</span>
                    <input
                      type="text"
                      value={step.title || ""}
                      onChange={(event) =>
                        updateProcessStep(
                          index,
                          "title",
                          event.target.value
                        )
                      }
                    />
                  </label>
                </div>

                <label className="admin-form-field">
                  <span>Açıklama</span>
                  <textarea
                    rows="3"
                    value={step.description || ""}
                    onChange={(event) =>
                      updateProcessStep(
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
              onClick={addProcessStep}
            >
              + Yeni süreç adımı
            </button>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>06</span>

            <div>
              <h2>Hakkımda ön izlemesi</h2>
              <p>Ana sayfadaki kısa hakkımda içeriği.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Üst etiket</span>
              <input
                type="text"
                value={form.aboutPreview.eyebrow}
                onChange={(event) =>
                  updateField(
                    "aboutPreview.eyebrow",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Başlık</span>
              <input
                type="text"
                value={form.aboutPreview.title}
                onChange={(event) =>
                  updateField(
                    "aboutPreview.title",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Açıklama</span>
              <textarea
                rows="5"
                value={form.aboutPreview.description}
                onChange={(event) =>
                  updateField(
                    "aboutPreview.description",
                    event.target.value
                  )
                }
              />
            </label>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>07</span>

            <div>
              <h2>İletişim çağrısı</h2>
              <p>Ana sayfanın sonundaki iletişim alanı.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Üst etiket</span>
              <input
                type="text"
                value={form.contactCta.eyebrow}
                onChange={(event) =>
                  updateField(
                    "contactCta.eyebrow",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Başlık</span>
              <input
                type="text"
                value={form.contactCta.title}
                onChange={(event) =>
                  updateField(
                    "contactCta.title",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Açıklama</span>
              <textarea
                rows="4"
                value={form.contactCta.description}
                onChange={(event) =>
                  updateField(
                    "contactCta.description",
                    event.target.value
                  )
                }
              />
            </label>

            <div className="admin-form-grid admin-form-grid--two">
              <label className="admin-form-field">
                <span>Buton metni</span>
                <input
                  type="text"
                  value={form.contactCta.buttonLabel}
                  onChange={(event) =>
                    updateField(
                      "contactCta.buttonLabel",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="admin-form-field">
                <span>Buton bağlantısı</span>
                <input
                  type="text"
                  value={form.contactCta.buttonHref}
                  placeholder="/iletisim"
                  onChange={(event) =>
                    updateField(
                      "contactCta.buttonHref",
                      event.target.value
                    )
                  }
                />
              </label>
            </div>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>08</span>

            <div>
              <h2>SEO ayarları</h2>
              <p>
                Arama sonuçlarında kullanılacak sayfa başlığı ve
                açıklaması.
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
                  updateField("seo.title", event.target.value)
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
                  updateField(
                    "seo.description",
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

export default AdminHomePage;