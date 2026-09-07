import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Layers3,
  PenTool,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import http from "../api/http";
import { useSiteSettings } from "../context/SiteContext";

const serviceIcons = [Braces, Layers3, PenTool, Sparkles];

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

const HomePage = () => {
  const { settings } = useSiteSettings();

  const [home, setHome] = useState(null);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    const loadPage = async () => {
      try {
        const [homeResponse, serviceResponse, projectResponse] =
          await Promise.all([
            http.get("/content/home", {
              signal: controller.signal,
            }),
            http.get("/services", {
              signal: controller.signal,
            }),
            http.get("/projects?featured=true&limit=4", {
              signal: controller.signal,
            }),
          ]);

        setHome(homeResponse.data.data);
        setServices(serviceResponse.data.data);
        setProjects(projectResponse.data.data);
        setStatus("success");
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error(error);
          setStatus("error");
        }
      }
    };

    loadPage();

    return () => controller.abort();
  }, []);

  if (status === "loading") {
    return (
      <section className="page-state">
        <span>YÇ / Loading</span>
        <p>Portfolio hazırlanıyor.</p>
      </section>
    );
  }

  if (status === "error" || !home) {
    return (
      <section className="page-state">
        <span>Connection error</span>
        <h1>İçerik yüklenemedi.</h1>
        <p>Backend sunucusunun çalıştığından emin olun.</p>
      </section>
    );
  }

  const sectionIsVisible = (key) => {
    if (!home.sections?.length) {
      return true;
    }

    return (
      home.sections.find((section) => section.key === key)
        ?.isVisible !== false
    );
  };

  const featuredProject = projects[0];
  const otherProjects = projects.slice(1);

  return (
    <>
      {sectionIsVisible("hero") && (
        <section className="showcase">
          <div className="showcase__canvas">
            <div className="signal-field" aria-hidden="true">
              <div className="signal-field__orbit" />
              <span className="signal-node signal-node--one" />
              <span className="signal-node signal-node--two" />
              <span className="signal-node signal-node--three" />
              <span className="signal-node signal-node--four" />
            </div>

            <div className="showcase__status">
              <span />
              {settings.contact?.availabilityText}
            </div>

            <div className="showcase__identity">
              <p>{home.hero?.eyebrow}</p>
              <h1>{settings.brand?.name}</h1>
              <span>{settings.brand?.profession}</span>
            </div>

            <div className="showcase__actions">
              <Link
                className="light-button"
                to={home.hero?.primaryCta?.href || "/projeler"}
              >
                {home.hero?.primaryCta?.label}
              </Link>

              <Link
                className="canvas-link"
                to={home.hero?.secondaryCta?.href || "/iletisim"}
              >
                {home.hero?.secondaryCta?.label}
                <ArrowUpRight size={15} />
              </Link>
            </div>

            <span className="showcase__coordinate showcase__coordinate--left">
              41.0082° N
            </span>

            <span className="showcase__coordinate showcase__coordinate--right">
              28.9784° E
            </span>
          </div>

          <aside className="showcase__rail">
            <article>
              <span>01 / Development</span>
              <h2>Digital systems</h2>
              <p>
                MERN ve WordPress ile ölçeklenebilir, yönetilebilir
                dijital ürünler.
              </p>
            </article>

            <article>
              <span>02 / Design</span>
              <h2>Visual experiences</h2>
              <p>
                Figma, Photoshop ve Illustrator ile güçlü arayüz ve
                görsel iletişim.
              </p>
            </article>

            <div className="showcase__rail-footer">
              <span>{settings.contact?.location}</span>
              <span>2026</span>
            </div>
          </aside>
        </section>
      )}

      <section className="manifesto">
        <p className="section-kicker">01 / Perspective</p>

        <h2>
          {renderHighlightedTitle(
            home.hero?.title || "",
            home.hero?.highlightedText || ""
          )}
        </h2>

        <p className="manifesto__description">
          {home.hero?.description}
        </p>
      </section>

      {sectionIsVisible("projects") && featuredProject && (
        <section className="projects-showcase">
          <header className="content-heading">
            <div>
              <p className="section-kicker">
                02 / {home.projectsIntro?.eyebrow}
              </p>
              <h2>{home.projectsIntro?.title}</h2>
            </div>

            <div>
              <p>{home.projectsIntro?.description}</p>

              <Link className="inline-link" to="/projeler">
                Tüm projeleri incele
                <ArrowRight size={17} />
              </Link>
            </div>
          </header>

          <Link
            className="featured-project"
            to={`/projeler/${featuredProject.slug}`}
          >
            <img
              src={featuredProject.coverImage?.url}
              alt={featuredProject.coverImage?.alt}
            />

            <div className="featured-project__overlay">
              <div>
                <span>{featuredProject.category}</span>
                <h3>{featuredProject.title}</h3>
              </div>

              <ArrowUpRight />
            </div>
          </Link>

          {otherProjects.length > 0 && (
            <div className="project-row">
              {otherProjects.map((project) => (
                <Link
                  className="project-tile"
                  to={`/projeler/${project.slug}`}
                  key={project._id}
                >
                  <div>
                    <img
                      src={project.coverImage?.url}
                      alt={project.coverImage?.alt}
                    />
                  </div>

                  <span>{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.shortDescription}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {sectionIsVisible("services") && (
        <section className="services-showcase">
          <header className="content-heading">
            <div>
              <p className="section-kicker">
                03 / {home.servicesIntro?.eyebrow}
              </p>
              <h2>{home.servicesIntro?.title}</h2>
            </div>

            <p>{home.servicesIntro?.description}</p>
          </header>

          <div className="service-grid">
            {services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];

              return (
                <article className="service-card" key={service._id}>
                  <div
                    className={`service-card__visual service-card__visual--${
                      (index % 4) + 1
                    }`}
                  >
                    <Icon aria-hidden="true" />

                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="service-card__content">
                    <p>{service.type}</p>
                    <h3>{service.title}</h3>
                    <span>{service.summary}</span>

                    <div>
                      {service.tools?.slice(0, 4).map((tool) => (
                        <small key={tool}>{tool}</small>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {sectionIsVisible("process") && (
        <section className="process-showcase">
          <header>
            <p className="section-kicker">
              04 / {home.processIntro?.eyebrow}
            </p>
            <h2>{home.processIntro?.title}</h2>
          </header>

          <div className="process-grid">
            {[...(home.processSteps || [])]
              .sort((a, b) => a.order - b.order)
              .map((step) => (
                <article key={step._id || step.number}>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
          </div>
        </section>
      )}

      {sectionIsVisible("about") && (
        <section className="about-feature">
          <div className="about-feature__field" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="about-feature__content">
            <p className="section-kicker">05 / About</p>
            <h2>{home.aboutPreview?.title}</h2>
            <p>{home.aboutPreview?.description}</p>

            <Link className="light-button" to="/hakkimda">
              Hakkımda
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

export default HomePage;