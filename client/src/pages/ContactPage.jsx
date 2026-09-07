import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import http from "../api/http";
import { usePageContent } from "../context/PageContentContext";
import { useSiteSettings } from "../context/SiteContext";

const allowedServices = [
  "web-development",
  "wordpress",
  "ui-ux",
  "graphic-design",
  "branding",
  "other",
];

const initialForm = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  message: "",
  website: "",
};

const renderHighlightedTitle = (title, highlightedText) => {
  if (!highlightedText || !title.includes(highlightedText)) {
    return title;
  }

  const index = title.indexOf(highlightedText);

  return (
    <>
      {title.slice(0, index)}
      <span className="gradient-text">{highlightedText}</span>
      {title.slice(index + highlightedText.length)}
    </>
  );
};

const ContactPage = () => {
  const { settings } = useSiteSettings();

  const {
    content: pageContent,
    loading: pageContentLoading,
    error: pageContentError,
  } = usePageContent();

  const copy = pageContent.contact || {};
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState(initialForm);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const requestedService = searchParams.get("service");

    if (allowedServices.includes(requestedService)) {
      setForm((current) => ({
        ...current,
        service: requestedService,
      }));
    }
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (feedback) {
      setFeedback("");
      setSubmitStatus("idle");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitStatus("submitting");
    setFeedback("");

    try {
      const response = await http.post("/contact", form);

      setSubmitStatus("success");
      setFeedback(response.data.message);
      setForm(initialForm);
    } catch (error) {
      setSubmitStatus("error");
      setFeedback(
        error.response?.data?.message ||
          copy.errorMessage ||
          "Mesaj gönderilemedi. Lütfen tekrar deneyin."
      );
    }
  };

  const socials = [...(settings.socials || [])]
    .filter((social) => social.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  const serviceOptions = [...(copy.serviceOptions || [])].sort(
    (a, b) => a.order - b.order
  );

  const budgetOptions = [...(copy.budgetOptions || [])].sort(
    (a, b) => a.order - b.order
  );

  if (pageContentLoading) {
    return (
      <section className="page-state">
        <p>İletişim sayfası hazırlanıyor.</p>
      </section>
    );
  }

  if (pageContentError) {
    return (
      <section className="page-state">
        <h1>İletişim içeriği yüklenemedi.</h1>
      </section>
    );
  }

  return (
    <div className="contact-page">
      <header className="contact-page__hero">
        <p className="section-kicker">{copy.heroKicker}</p>

        <h1>
          {renderHighlightedTitle(
            copy.title || "",
            copy.highlightedText || ""
          )}
        </h1>
      </header>

      <section className="contact-layout">
        <aside className="contact-information">
          <div
            className="contact-information__visual"
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
            <div />
          </div>

          <div className="contact-information__content">
            <p>{settings.contact?.availabilityText}</p>

            <dl>
              {settings.contact?.email && (
                <div>
                  <dt>{copy.emailLabel}</dt>
                  <dd>
                    <a href={`mailto:${settings.contact.email}`}>
                      {settings.contact.email}
                    </a>
                  </dd>
                </div>
              )}

              {settings.contact?.phone && (
                <div>
                  <dt>{copy.phoneLabel}</dt>
                  <dd>
                    <a href={`tel:${settings.contact.phone}`}>
                      {settings.contact.phone}
                    </a>
                  </dd>
                </div>
              )}

              <div>
                <dt>{copy.locationLabel}</dt>
                <dd>{settings.contact?.location}</dd>
              </div>
            </dl>

            {socials.length > 0 && (
              <nav aria-label="Sosyal medya hesapları">
                {socials.map((social) => (
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    key={social._id || social.url}
                  >
                    {social.platform}
                    <ArrowUpRight size={14} />
                  </a>
                ))}
              </nav>
            )}
          </div>
        </aside>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form__row">
            <label>
              <span>{copy.nameLabel}</span>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                minLength={2}
                maxLength={80}
                autoComplete="name"
                required
              />
            </label>

            <label>
              <span>{copy.formEmailLabel}</span>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                maxLength={160}
                autoComplete="email"
                required
              />
            </label>
          </div>

          <div className="contact-form__row">
            <label>
              <span>{copy.companyLabel}</span>

              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                maxLength={120}
                autoComplete="organization"
              />
            </label>

            <label>
              <span>{copy.serviceLabel}</span>

              <select
                name="service"
                value={form.service}
                onChange={handleChange}
              >
                <option value="">
                  {copy.servicePlaceholder}
                </option>

                {serviceOptions.map((option) => (
                  <option
                    value={option.value}
                    key={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span>{copy.budgetLabel}</span>

            <select
              name="budget"
              value={form.budget}
              onChange={handleChange}
            >
              <option value="">
                {copy.budgetPlaceholder}
              </option>

              {budgetOptions.map((option) => (
                <option
                  value={option.value}
                  key={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{copy.messageLabel}</span>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              minLength={20}
              maxLength={3000}
              rows={7}
              required
            />
          </label>

          <label
            className="contact-honeypot"
            aria-hidden="true"
          >
            Website

            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>

          <div className="contact-form__footer">
            <p>{copy.consentText}</p>

            <button
              className="light-button"
              type="submit"
              disabled={submitStatus === "submitting"}
            >
              {submitStatus === "submitting"
                ? copy.submittingLabel
                : copy.submitLabel}

              <ArrowUpRight size={15} />
            </button>
          </div>

          {feedback && (
            <p
              className={`contact-form__feedback is-${submitStatus}`}
              role="status"
            >
              {feedback}
            </p>
          )}
        </form>
      </section>
    </div>
  );
};

export default ContactPage;