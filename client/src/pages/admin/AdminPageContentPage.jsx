import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Save } from "lucide-react";

import http from "../../api/http";
import { usePageContent } from "../../context/PageContentContext";
import pageContentFields from "../../data/pageContentFields";

const cloneContent = (value) => structuredClone(value);

const getNestedValue = (source, path) => {
  return path.split(".").reduce((current, key) => {
    if (current === undefined || current === null) {
      return "";
    }

    return current[key];
  }, source);
};

const setNestedValue = (source, path, value) => {
  const clone = cloneContent(source);
  const keys = path.split(".");

  let target = clone;

  keys.slice(0, -1).forEach((key, index) => {
    const nextKey = keys[index + 1];
    const shouldBeArray = /^\d+$/.test(nextKey);

    if (target[key] === undefined || target[key] === null) {
      target[key] = shouldBeArray ? [] : {};
    }

    target = target[key];
  });

  target[keys.at(-1)] = value;

  return clone;
};

const AdminPageContentPage = () => {
  const {
    content,
    loading,
    error,
    replaceContent,
  } = usePageContent();

  const [activeSection, setActiveSection] = useState("home");
  const [draft, setDraft] = useState(() => cloneContent(content));
  const [saveStatus, setSaveStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setDraft(cloneContent(content));
  }, [content]);

  const currentSection = useMemo(
    () =>
      pageContentFields.find(
        (section) => section.key === activeSection
      ),
    [activeSection]
  );

  const handleFieldChange = (path, value) => {
    setDraft((current) =>
      setNestedValue(current, path, value)
    );

    setFeedback("");
  };

  const handleReset = () => {
    setDraft(cloneContent(content));
    setFeedback("Kaydedilmemiş değişiklikler geri alındı.");
    setSaveStatus("idle");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaveStatus("saving");
    setFeedback("");

    try {
      const response = await http.put("/page-content", {
        home: draft.home,
        projects: draft.projects,
        services: draft.services,
        about: draft.about,
        projectDetail: draft.projectDetail,
        contact: draft.contact,
      });

      replaceContent(response.data.data);
      setSaveStatus("success");
      setFeedback(
        response.data.message ||
          "Sayfa metinleri başarıyla kaydedildi."
      );
    } catch (requestError) {
      console.error(requestError);

      setSaveStatus("error");
      setFeedback(
        requestError.response?.data?.message ||
          "Sayfa metinleri kaydedilemedi."
      );
    }
  };

  if (loading) {
    return (
      <section className="admin-page-content-state">
        Sayfa metinleri yükleniyor.
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-page-content-state">
        Sayfa metinleri alınamadı. Backend sunucusunu kontrol edin.
      </section>
    );
  }

  return (
    <div className="admin-page-content">
      <header className="admin-page-content__header">
        <div>
          <p className="admin-eyebrow">Content management</p>
          <h1>Sayfa metinleri</h1>
          <p>
            Public sayfalardaki başlıkları, açıklamaları, alan
            etiketlerini ve durum mesajlarını buradan yönetebilirsin.
          </p>
        </div>

        <div className="admin-page-content__actions">
          <button
            className="admin-secondary-button"
            type="button"
            onClick={handleReset}
            disabled={saveStatus === "saving"}
          >
            <RotateCcw size={16} />
            Değişiklikleri geri al
          </button>

          <button
            className="admin-primary-button"
            type="submit"
            form="page-content-form"
            disabled={saveStatus === "saving"}
          >
            <Save size={16} />
            {saveStatus === "saving"
              ? "Kaydediliyor..."
              : "Tümünü kaydet"}
          </button>
        </div>
      </header>

      <nav
        className="admin-page-tabs"
        aria-label="Düzenlenecek sayfa"
      >
        {pageContentFields.map((section) => (
          <button
            type="button"
            key={section.key}
            className={
              activeSection === section.key ? "is-active" : ""
            }
            onClick={() => setActiveSection(section.key)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <form
        id="page-content-form"
        className="admin-page-content__form"
        onSubmit={handleSubmit}
      >
        <header className="admin-page-content__section-header">
          <span>
            {String(
              pageContentFields.findIndex(
                (item) => item.key === currentSection?.key
              ) + 1
            ).padStart(2, "0")}
          </span>

          <h2>{currentSection?.label}</h2>
        </header>

        {currentSection?.groups.map((group) => (
          <section
            className="admin-content-group"
            key={group.title}
          >
            <div className="admin-content-group__heading">
              <h3>{group.title}</h3>
              <span>{group.fields.length} alan</span>
            </div>

            <div className="admin-content-fields">
              {group.fields.map((item) => {
                const value =
                  getNestedValue(draft, item.path) ?? "";

                return (
                  <label
                    className={
                      item.type === "textarea"
                        ? "admin-content-field admin-content-field--wide"
                        : "admin-content-field"
                    }
                    key={item.path}
                  >
                    <span>{item.label}</span>

                    {item.type === "textarea" ? (
                      <textarea
                        rows={4}
                        value={value}
                        onChange={(event) =>
                          handleFieldChange(
                            item.path,
                            event.target.value
                          )
                        }
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(event) =>
                          handleFieldChange(
                            item.path,
                            event.target.value
                          )
                        }
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        ))}

        {feedback && (
          <p
            className={`admin-page-content__feedback is-${saveStatus}`}
            role="status"
          >
            {feedback}
          </p>
        )}
      </form>
    </div>
  );
};

export default AdminPageContentPage;