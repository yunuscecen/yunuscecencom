import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import http from "../api/http";
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

const ContactPage = () => {
  const { settings } = useSiteSettings();
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
          "Mesaj gönderilemedi. Lütfen tekrar deneyin."
      );
    }
  };

  const socials = [...(settings.socials || [])]
    .filter((social) => social.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="contact-page">
      <header className="contact-page__hero">
        <p className="section-kicker">Contact / Start a project</p>

        <h1>
          Birlikte çalışan ve <span className="gradient-text">iz bırakan</span>{" "}
          bir şey üretelim.
        </h1>
      </header>

      <section className="contact-layout">
        <aside className="contact-information">
          <div className="contact-information__visual" aria-hidden="true">
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
                  <dt>E-posta</dt>
                  <dd>
                    <a href={`mailto:${settings.contact.email}`}>
                      {settings.contact.email}
                    </a>
                  </dd>
                </div>
              )}

              {settings.contact?.phone && (
                <div>
                  <dt>Telefon</dt>
                  <dd>
                    <a href={`tel:${settings.contact.phone}`}>
                      {settings.contact.phone}
                    </a>
                  </dd>
                </div>
              )}

              <div>
                <dt>Konum</dt>
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
              <span>Ad soyad *</span>
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
              <span>E-posta *</span>
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
              <span>Şirket veya marka</span>
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
              <span>İlgilendiğin hizmet</span>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
              >
                <option value="">Seçiniz</option>
                <option value="web-development">
                  MERN Web Development
                </option>
                <option value="wordpress">WordPress</option>
                <option value="ui-ux">UI / UX Design</option>
                <option value="graphic-design">
                  Graphic Design
                </option>
                <option value="branding">Branding</option>
                <option value="other">Diğer</option>
              </select>
            </label>
          </div>

          <label>
            <span>Tahmini bütçe</span>
            <select
              name="budget"
              value={form.budget}
              onChange={handleChange}
            >
              <option value="">Belirtilmedi</option>
              <option value="10.000 - 25.000 TL">
                10.000 – 25.000 TL
              </option>
              <option value="25.000 - 50.000 TL">
                25.000 – 50.000 TL
              </option>
              <option value="50.000 - 100.000 TL">
                50.000 – 100.000 TL
              </option>
              <option value="100.000 TL ve üzeri">
                100.000 TL ve üzeri
              </option>
              <option value="Karar verilmedi">
                Henüz karar verilmedi
              </option>
            </select>
          </label>

          <label>
            <span>Projeden bahset *</span>
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

          <label className="contact-honeypot" aria-hidden="true">
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
            <p>
              Formu göndererek iletişim amacıyla verdiğiniz bilgilerin
              kullanılmasını kabul etmiş olursunuz.
            </p>

            <button
              className="submit-button"
              type="submit"
              disabled={submitStatus === "submitting"}
            >
              {submitStatus === "submitting"
                ? "Gönderiliyor..."
                : "Mesajı gönder"}

              <ArrowUpRight size={16} />
            </button>
          </div>

          {feedback && (
            <div
              className={`form-feedback form-feedback--${submitStatus}`}
              role="status"
            >
              {feedback}
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

export default ContactPage;