import { useEffect, useRef, useState } from "react";

import AdminMediaField from "../../components/admin/AdminMediaField";
import { useSiteSettings } from "../../context/SiteContext";
import http from "../../api/http";

const defaultSettings = {
  key: "main",

  brand: {
    name: "",
    shortName: "",
    profession: "",
    logoUrl: "",
    logoPublicId: "",
    logoAlt: "",
  },

  header: {
    contactLabel: "",
    contactHref: "",
    showContactButton: true,
  },

  navigation: [],

  contact: {
    email: "",
    phone: "",
    location: "",
    availabilityText: "",
  },

  socials: [],

  footer: {
    eyebrow: "",
    title: "",
    description: "",
    buttonLabel: "",
    buttonHref: "",
    copyrightText: "",
  },

  seo: {
    defaultTitle: "",
    titleTemplate: "",
    description: "",
    keywords: [],
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

const mergeSettings = (data = {}) => ({
  ...defaultSettings,
  ...data,

  brand: {
    ...defaultSettings.brand,
    ...data.brand,
  },

  header: {
    ...defaultSettings.header,
    ...data.header,
  },

  navigation: sortByOrder(data.navigation),

  contact: {
    ...defaultSettings.contact,
    ...data.contact,
  },

  socials: sortByOrder(data.socials),

  footer: {
    ...defaultSettings.footer,
    ...data.footer,
  },

  seo: {
    ...defaultSettings.seo,
    ...data.seo,
  },
});

const AdminSettingsPage = () => {
  const { replaceSettings } = useSiteSettings();
  const originalLogoPublicId = useRef("");

  const [form, setForm] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const response = await http.get("/content/settings");
        const settings = mergeSettings(extractData(response));

        if (!active) return;

        setForm(settings);
        originalLogoPublicId.current =
          settings.brand?.logoPublicId || "";
      } catch (error) {
        if (!active) return;

        setFeedback({
          type: "error",
          message:
            error.response?.data?.message ||
            "Site ayarları alınamadı.",
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const updateSection = (section, field, value) => {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));

    setFeedback(null);
  };

  const updateArrayItem = (
    section,
    index,
    field,
    value
  ) => {
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

  const addArrayItem = (section, item) => {
    setForm((current) => ({
      ...current,
      [section]: [
        ...current[section],
        {
          ...item,
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

  const moveArrayItem = (
    section,
    index,
    direction
  ) => {
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

  const validateForm = () => {
    if (!form.brand.name.trim()) {
      return "Marka adı boş bırakılamaz.";
    }

    if (
      form.navigation.some(
        (item) =>
          !item.label?.trim() || !item.href?.trim()
      )
    ) {
      return "Her navigasyon öğesinde başlık ve bağlantı olmalı.";
    }

    if (
      form.socials.some(
        (item) =>
          !item.platform?.trim() || !item.url?.trim()
      )
    ) {
      return "Her sosyal medya kaydında platform ve URL olmalı.";
    }

    if (
      form.contact.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.contact.email
      )
    ) {
      return "Geçerli bir e-posta adresi yazmalısın.";
    }

    return null;
  };

  const preparePayload = () => ({
    ...form,

    brand: {
      ...form.brand,
      name: form.brand.name.trim(),
      shortName: form.brand.shortName.trim(),
      profession: form.brand.profession.trim(),
      logoUrl: form.brand.logoUrl || "",
      logoPublicId: form.brand.logoPublicId || "",
      logoAlt: form.brand.logoAlt?.trim() || "",
    },

    navigation: form.navigation.map((item, index) => ({
      ...item,
      label: item.label.trim(),
      href: item.href.trim(),
      order: index,
    })),

    contact: {
      ...form.contact,
      email: form.contact.email.trim().toLowerCase(),
      phone: form.contact.phone.trim(),
      location: form.contact.location.trim(),
      availabilityText:
        form.contact.availabilityText.trim(),
    },

    socials: form.socials.map((item, index) => ({
      ...item,
      platform: item.platform.trim(),
      username: item.username?.trim() || "",
      url: item.url.trim(),
      order: index,
    })),

    seo: {
      ...form.seo,
      keywords: (form.seo.keywords || [])
        .map((keyword) => keyword.trim())
        .filter(Boolean),
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

      const previousLogoPublicId =
        originalLogoPublicId.current;

      const response = await http.put(
        "/content/settings",
        preparePayload()
      );

      const savedSettings = mergeSettings(
        extractData(response)
      );

      setForm(savedSettings);
      replaceSettings(savedSettings);

      const currentLogoPublicId =
        savedSettings.brand?.logoPublicId || "";

      originalLogoPublicId.current =
        currentLogoPublicId;

      let cleanupWarning = false;

      if (
        previousLogoPublicId &&
        previousLogoPublicId !== currentLogoPublicId
      ) {
        try {
          await http.delete("/admin/media", {
            data: {
              publicId: previousLogoPublicId,
            },
          });
        } catch {
          cleanupWarning = true;
        }
      }

      setFeedback({
        type: cleanupWarning ? "warning" : "success",
        message: cleanupWarning
          ? "Ayarlar kaydedildi fakat eski logo medya arşivinden silinemedi."
          : "Site ayarları başarıyla kaydedildi.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Site ayarları kaydedilemedi.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="admin-page-state">
        <span>Site ayarları yükleniyor...</span>
      </section>
    );
  }

  return (
    <div className="admin-editor">
      <header className="admin-editor-header">
        <div>
          <span className="admin-editor-eyebrow">
            Global yönetim
          </span>

          <h1>Site ayarları</h1>

          <p>
            Header, Footer, navigasyon, iletişim ve SEO
            ayarlarını tek yerden yönet.
          </p>
        </div>

        <button
          className="admin-primary-button"
          type="submit"
          form="admin-settings-form"
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
        id="admin-settings-form"
        className="admin-editor-form"
        onSubmit={handleSubmit}
      >
        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>01</span>
            <div>
              <h2>Marka ve logo</h2>
              <p>Header ve Footer’da kullanılan kimlik bilgileri.</p>
            </div>
          </div>

          <div className="admin-form-grid admin-form-grid--two">
            <label className="admin-form-field">
              <span>Ad soyad / marka adı</span>
              <input
                type="text"
                value={form.brand.name}
                onChange={(event) =>
                  updateSection(
                    "brand",
                    "name",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Kısa ad</span>
              <input
                type="text"
                value={form.brand.shortName}
                placeholder="YÇ"
                onChange={(event) =>
                  updateSection(
                    "brand",
                    "shortName",
                    event.target.value
                  )
                }
              />
            </label>
          </div>

          <label className="admin-form-field">
            <span>Meslek / unvan</span>
            <input
              type="text"
              value={form.brand.profession}
              onChange={(event) =>
                updateSection(
                  "brand",
                  "profession",
                  event.target.value
                )
              }
            />
          </label>

          <AdminMediaField
            label="Site logosu"
            folder="general"
            showCaption={false}
            value={{
              url: form.brand.logoUrl,
              publicId: form.brand.logoPublicId,
              alt: form.brand.logoAlt,
            }}
            onChange={(media) => {
              setForm((current) => ({
                ...current,
                brand: {
                  ...current.brand,
                  logoUrl: media.url || "",
                  logoPublicId: media.publicId || "",
                  logoAlt: media.alt || "",
                },
              }));
            }}
          />
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>02</span>
            <div>
              <h2>Header butonu</h2>
              <p>Header’ın sağındaki iletişim çağrısı.</p>
            </div>
          </div>

          <div className="admin-form-grid admin-form-grid--two">
            <label className="admin-form-field">
              <span>Buton metni</span>
              <input
                type="text"
                value={form.header.contactLabel}
                onChange={(event) =>
                  updateSection(
                    "header",
                    "contactLabel",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Buton bağlantısı</span>
              <input
                type="text"
                value={form.header.contactHref}
                placeholder="/iletisim"
                onChange={(event) =>
                  updateSection(
                    "header",
                    "contactHref",
                    event.target.value
                  )
                }
              />
            </label>
          </div>

          <label className="admin-check-field">
            <input
              type="checkbox"
              checked={form.header.showContactButton}
              onChange={(event) =>
                updateSection(
                  "header",
                  "showContactButton",
                  event.target.checked
                )
              }
            />
            <span>Header iletişim butonunu göster</span>
          </label>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>03</span>
            <div>
              <h2>Navigasyon</h2>
              <p>Menü bağlantılarını ekle, gizle veya sırala.</p>
            </div>
          </div>

          <div className="admin-repeatable-list">
            {form.navigation.map((item, index) => (
              <article
                className="admin-repeatable-item"
                key={item._id || `navigation-${index}`}
              >
                <div className="admin-repeatable-item__heading">
                  <strong>Menü öğesi {index + 1}</strong>

                  <div className="admin-repeatable-actions">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveArrayItem("navigation", index, -1)
                      }
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index === form.navigation.length - 1
                      }
                      onClick={() =>
                        moveArrayItem("navigation", index, 1)
                      }
                    >
                      ↓
                    </button>

                    <button
                      className="is-danger"
                      type="button"
                      onClick={() =>
                        removeArrayItem("navigation", index)
                      }
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <div className="admin-form-grid admin-form-grid--two">
                  <label className="admin-form-field">
                    <span>Başlık</span>
                    <input
                      type="text"
                      value={item.label || ""}
                      onChange={(event) =>
                        updateArrayItem(
                          "navigation",
                          index,
                          "label",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-form-field">
                    <span>Bağlantı</span>
                    <input
                      type="text"
                      value={item.href || ""}
                      placeholder="/projeler"
                      onChange={(event) =>
                        updateArrayItem(
                          "navigation",
                          index,
                          "href",
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
                      checked={item.isVisible !== false}
                      onChange={(event) =>
                        updateArrayItem(
                          "navigation",
                          index,
                          "isVisible",
                          event.target.checked
                        )
                      }
                    />
                    <span>Menüde göster</span>
                  </label>

                  <label className="admin-check-field">
                    <input
                      type="checkbox"
                      checked={Boolean(item.isExternal)}
                      onChange={(event) =>
                        updateArrayItem(
                          "navigation",
                          index,
                          "isExternal",
                          event.target.checked
                        )
                      }
                    />
                    <span>Harici bağlantı</span>
                  </label>
                </div>
              </article>
            ))}

            <button
              className="admin-add-button"
              type="button"
              onClick={() =>
                addArrayItem("navigation", {
                  label: "",
                  href: "",
                  isExternal: false,
                  isVisible: true,
                })
              }
            >
              + Yeni menü öğesi
            </button>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>04</span>
            <div>
              <h2>İletişim bilgileri</h2>
              <p>Site genelinde kullanılan iletişim bilgileri.</p>
            </div>
          </div>

          <div className="admin-form-grid admin-form-grid--two">
            <label className="admin-form-field">
              <span>E-posta</span>
              <input
                type="email"
                value={form.contact.email}
                onChange={(event) =>
                  updateSection(
                    "contact",
                    "email",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Telefon</span>
              <input
                type="text"
                value={form.contact.phone}
                onChange={(event) =>
                  updateSection(
                    "contact",
                    "phone",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Konum</span>
              <input
                type="text"
                value={form.contact.location}
                onChange={(event) =>
                  updateSection(
                    "contact",
                    "location",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Müsaitlik bilgisi</span>
              <input
                type="text"
                value={form.contact.availabilityText}
                onChange={(event) =>
                  updateSection(
                    "contact",
                    "availabilityText",
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
              <h2>Sosyal medya</h2>
              <p>Footer’da gösterilecek sosyal bağlantılar.</p>
            </div>
          </div>

          <div className="admin-repeatable-list">
            {form.socials.map((social, index) => (
              <article
                className="admin-repeatable-item"
                key={social._id || `social-${index}`}
              >
                <div className="admin-repeatable-item__heading">
                  <strong>Sosyal bağlantı {index + 1}</strong>

                  <div className="admin-repeatable-actions">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveArrayItem("socials", index, -1)
                      }
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={index === form.socials.length - 1}
                      onClick={() =>
                        moveArrayItem("socials", index, 1)
                      }
                    >
                      ↓
                    </button>

                    <button
                      className="is-danger"
                      type="button"
                      onClick={() =>
                        removeArrayItem("socials", index)
                      }
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <div className="admin-form-grid admin-form-grid--two">
                  <label className="admin-form-field">
                    <span>Platform</span>
                    <input
                      type="text"
                      value={social.platform || ""}
                      placeholder="GitHub"
                      onChange={(event) =>
                        updateArrayItem(
                          "socials",
                          index,
                          "platform",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label className="admin-form-field">
                    <span>Kullanıcı adı</span>
                    <input
                      type="text"
                      value={social.username || ""}
                      placeholder="@yunuscecen"
                      onChange={(event) =>
                        updateArrayItem(
                          "socials",
                          index,
                          "username",
                          event.target.value
                        )
                      }
                    />
                  </label>
                </div>

                <label className="admin-form-field">
                  <span>Profil URL’si</span>
                  <input
                    type="url"
                    value={social.url || ""}
                    placeholder="https://github.com/..."
                    onChange={(event) =>
                      updateArrayItem(
                        "socials",
                        index,
                        "url",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="admin-check-field">
                  <input
                    type="checkbox"
                    checked={social.isVisible !== false}
                    onChange={(event) =>
                      updateArrayItem(
                        "socials",
                        index,
                        "isVisible",
                        event.target.checked
                      )
                    }
                  />
                  <span>Footer’da göster</span>
                </label>
              </article>
            ))}

            <button
              className="admin-add-button"
              type="button"
              onClick={() =>
                addArrayItem("socials", {
                  platform: "",
                  username: "",
                  url: "",
                  isVisible: true,
                })
              }
            >
              + Yeni sosyal bağlantı
            </button>
          </div>
        </section>

        <section className="admin-editor-card">
          <div className="admin-editor-card__heading">
            <span>06</span>
            <div>
              <h2>Footer içeriği</h2>
              <p>Sayfaların altındaki ortak çağrı alanı.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Üst etiket</span>
              <input
                type="text"
                value={form.footer.eyebrow}
                onChange={(event) =>
                  updateSection(
                    "footer",
                    "eyebrow",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Başlık</span>
              <input
                type="text"
                value={form.footer.title}
                onChange={(event) =>
                  updateSection(
                    "footer",
                    "title",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Açıklama</span>
              <textarea
                rows="4"
                value={form.footer.description}
                onChange={(event) =>
                  updateSection(
                    "footer",
                    "description",
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
                  value={form.footer.buttonLabel}
                  onChange={(event) =>
                    updateSection(
                      "footer",
                      "buttonLabel",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="admin-form-field">
                <span>Buton bağlantısı</span>
                <input
                  type="text"
                  value={form.footer.buttonHref}
                  onChange={(event) =>
                    updateSection(
                      "footer",
                      "buttonHref",
                      event.target.value
                    )
                  }
                />
              </label>
            </div>

            <label className="admin-form-field">
              <span>Telif metni</span>
              <input
                type="text"
                value={form.footer.copyrightText}
                onChange={(event) =>
                  updateSection(
                    "footer",
                    "copyrightText",
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
              <h2>Genel SEO</h2>
              <p>Varsayılan başlık, açıklama ve anahtar kelimeler.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="admin-form-field">
              <span>Varsayılan başlık</span>
              <input
                type="text"
                maxLength="70"
                value={form.seo.defaultTitle}
                onChange={(event) =>
                  updateSection(
                    "seo",
                    "defaultTitle",
                    event.target.value
                  )
                }
              />
              <small>{form.seo.defaultTitle.length}/70</small>
            </label>

            <label className="admin-form-field">
              <span>Başlık şablonu</span>
              <input
                type="text"
                value={form.seo.titleTemplate}
                placeholder="%s | Yunus Çeçen"
                onChange={(event) =>
                  updateSection(
                    "seo",
                    "titleTemplate",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="admin-form-field">
              <span>Genel açıklama</span>
              <textarea
                rows="4"
                maxLength="170"
                value={form.seo.description}
                onChange={(event) =>
                  updateSection(
                    "seo",
                    "description",
                    event.target.value
                  )
                }
              />
              <small>{form.seo.description.length}/170</small>
            </label>

            <label className="admin-form-field">
              <span>Anahtar kelimeler</span>
              <input
                type="text"
                value={(form.seo.keywords || []).join(", ")}
                placeholder="MERN, React, WordPress, Grafik Tasarım"
                onChange={(event) =>
                  updateSection(
                    "seo",
                    "keywords",
                    event.target.value.split(",")
                  )
                }
              />
              <small>Kelimeleri virgülle ayır.</small>
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

export default AdminSettingsPage;