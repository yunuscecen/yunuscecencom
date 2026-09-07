import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Braces,
  Layers3,
  PenTool,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import ManagedImage from "../components/ui/ManagedImage";
import http from "../api/http";
import { usePageContent } from "../context/PageContentContext";

const icons = [Braces, Layers3, PenTool, Sparkles];

const contactServiceMap = {
  "mern-web-development": "web-development",
  "wordpress-development": "wordpress",
  "ui-ux-design": "ui-ux",
  "graphic-visual-design": "graphic-design",
};

const ServicesPage = () => {
  const {
    content: pageContent,
    loading: pageContentLoading,
    error: pageContentError,
  } = usePageContent();

  const copy = pageContent.services || {};

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

  if (pageContentLoading) {
    return (
      <section className="catalog-state">
        <p>Sayfa hazırlanıyor.</p>
      </section>
    );
  }

  return (
   <div className="services-page">
 <Seo
  title={copy.seo?.title || copy.title}
  description={
    copy.seo?.description || copy.description
  }
  schemaType="Service"
/>
      <header className="services-page__hero">
        <p className="section-kicker">{copy.heroKicker}</p>

        <div>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
      </header>

      {status === "loading" && (
        <section className="catalog-state">
          <p>{copy.loadingText}</p>
        </section>
      )}

      {(status === "error" || pageContentError) && (
        <section className="catalog-state">
          <p>{copy.errorText}</p>
        </section>
      )}

      {status === "success" && services.length === 0 && (
        <section className="catalog-state">
          <p>{copy.emptyText}</p>
        </section>
      )}

      {status === "success" && services.length > 0 && (
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
                {service.coverImage?.url ? (
                  <ManagedImage
                    className="service-detail__visual service-detail__visual--image"
                    src={service.coverImage.url}
                    alt={
                      service.coverImage.alt || service.title
                    }
                    badge={`${String(index + 1).padStart(
                      2,
                      "0"
                    )} / Service`}
                  />
                ) : (
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
                )}

                <div className="service-detail__content">
                  <p className="section-kicker">
                    {service.type}
                  </p>

                  <h2>{service.title}</h2>
                  <p>{service.description || service.summary}</p>

                  {service.deliverables?.length > 0 && (
                    <div className="deliverables">
                      <span>{copy.deliverablesLabel}</span>

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
                    {copy.contactButtonLabel}
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