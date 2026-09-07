import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Braces,
  Layers3,
  PenTool,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import http from "../api/http";

const icons = [Braces, Layers3, PenTool, Sparkles];

const contactServiceMap = {
  "mern-web-development": "web-development",
  "wordpress-development": "wordpress",
  "ui-ux-design": "ui-ux",
  "graphic-visual-design": "graphic-design",
};

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    const loadServices = async () => {
      try {
        const response = await http.get("/services", {
          signal: controller.signal,
        });

        setServices(response.data.data);
        setStatus("success");
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error(error);
          setStatus("error");
        }
      }
    };

    loadServices();

    return () => controller.abort();
  }, []);

  return (
    <div className="services-page">
      <header className="services-page__hero">
        <p className="section-kicker">Services / Capabilities</p>

        <div>
          <h1>Bir fikrin ihtiyaç duyduğu teknik ve görsel sistem.</h1>

          <p>
            Geliştirme ve tasarım hizmetleri birbirinden bağımsız
            veya uçtan uca tek bir üretim süreci olarak sunulabilir.
          </p>
        </div>
      </header>

      {status === "loading" && (
        <section className="catalog-state">
          <p>Hizmetler yükleniyor.</p>
        </section>
      )}

      {status === "error" && (
        <section className="catalog-state">
          <p>Hizmetler şu anda yüklenemiyor.</p>
        </section>
      )}

      {status === "success" && (
        <section className="service-details">
          {services.map((service, index) => {
            const Icon = icons[index % icons.length];
            const contactService =
              contactServiceMap[service.slug] || "other";

            return (
              <article
                className="service-detail"
                id={service.slug}
                key={service._id}
              >
                <div
                  className={`service-detail__visual service-detail__visual--${
                    (index % 4) + 1
                  }`}
                >
                  <div className="service-detail__grid" />
                  <Icon aria-hidden="true" />

                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="service-detail__content">
                  <p className="section-kicker">{service.type}</p>
                  <h2>{service.title}</h2>
                  <p>{service.description || service.summary}</p>

                  {service.deliverables?.length > 0 && (
                    <div className="deliverables">
                      <span>Teslim kapsamı</span>

                      <ul>
                        {service.deliverables.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="service-tools">
                    {service.tools?.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>

                  <Link
                    className="light-button"
                    to={`/iletisim?service=${contactService}`}
                  >
                    Projeyi konuşalım
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default ServicesPage;