import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Layers3,
  PenTool,
  Sparkles,
} from "lucide-react";
import {
  SiBehance,
  SiExpress,
  SiFigma,
  SiGithub,
  SiMongodb,
  SiNodedotjs,
  SiReact,
  SiTypescript,
  SiUpwork,
  SiWordpress,
} from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import BrandName from "../components/ui/BrandName";
import {
  DiIllustrator,
  DiPhotoshop,
} from "react-icons/di";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import ManagedImage from "../components/ui/ManagedImage";
import http from "../api/http";
import { usePageContent } from "../context/PageContentContext";
import { useSiteSettings } from "../context/SiteContext";
import { mergeAdvertisingPortfolio } from "../data/advertisingPortfolio";


const serviceIcons = [Braces, Layers3, PenTool, Sparkles];
const heroSocialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/yunuscecen",
    className: "is-github",
    Icon: SiGithub,
  },
  {
    name: "Behance",
    url: "https://www.behance.net/yunusccn",
    className: "is-behance",
    Icon: SiBehance,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/yunuscecen/",
    className: "is-linkedin",
    Icon: FaLinkedinIn,
  },
  {
    name: "Upwork",
    url: "https://www.upwork.com/freelancers/~0197449027a5bf721f?viewMode=1",
    className: "is-upwork",
    Icon: SiUpwork,
  },
];
const technologyLogos = [
  {
    name: "MongoDB",
    category: "Database",
    Icon: SiMongodb,
    description:
      "Proje verilerini esnek, yönetilebilir ve büyümeye hazır bir yapıda saklayan altyapılar kuruyorum.",
  },
  {
    name: "Express",
    category: "Backend",
    Icon: SiExpress,
    description:
      "Yönetim panellerini ve iş süreçlerini destekleyen güvenli, hızlı ve sürdürülebilir API servisleri geliştiriyorum.",
  },
  {
    name: "React",
    category: "Frontend",
    Icon: SiReact,
    description:
      "Markanıza özel, hızlı ve farklı ekranlara uyum sağlayan modern kullanıcı deneyimleri oluşturuyorum.",
  },
  {
    name: "Node.js",
    category: "Runtime",
    Icon: SiNodedotjs,
    description:
      "Web uygulamalarının arka planında çalışan performanslı ve geliştirilebilir sunucu sistemleri hazırlıyorum.",
  },
  {
    name: "TypeScript",
    category: "Language",
    Icon: SiTypescript,
    description:
      "Daha az hata üreten, bakımı kolay ve uzun vadede güvenle geliştirilebilen kod tabanları oluşturuyorum.",
  },
  {
    name: "WordPress",
    category: "CMS",
    Icon: SiWordpress,
    description:
      "İçeriği kolayca yönetilebilen kurumsal siteler, portfolyolar ve ihtiyaca özel WordPress çözümleri sunuyorum.",
  },
  {
    name: "Figma",
    category: "UI / UX",
    Icon: SiFigma,
    description:
      "Kullanıcı akışlarından geliştirilmeye hazır ekranlara kadar tutarlı ve işlevsel arayüz sistemleri tasarlıyorum.",
  },
  {
    name: "Photoshop",
    category: "Visual Design",
    Icon: DiPhotoshop,
    description:
      "Reklam görselleri, sosyal medya içerikleri ve marka iletişimini güçlendiren dijital tasarımlar hazırlıyorum.",
  },
  {
    name: "Illustrator",
    category: "Vector Design",
    Icon: DiIllustrator,
    description:
      "Logo, ikon ve farklı ölçülerde kalitesini koruyan profesyonel vektörel marka materyalleri tasarlıyorum.",
  },
];
const activateProcessBodyBackground = (index) => {
  const primaryHue = (212 + index * 43) % 360;
  const secondaryHue = (258 + index * 43) % 360;

  document.body.style.setProperty(
    "--process-body-hue",
    String(primaryHue)
  );

  document.body.style.setProperty(
    "--process-body-hue-alt",
    String(secondaryHue)
  );

  document.body.classList.add(
    "has-process-background"
  );
};

const clearProcessBodyBackground = () => {
  document.body.classList.remove(
    "has-process-background"
  );

  document.body.style.removeProperty(
    "--process-body-hue"
  );

  document.body.style.removeProperty(
    "--process-body-hue-alt"
  );
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

const HomePage = () => {
  const { settings } = useSiteSettings();

  const {
    content: pageContent,
    loading: pageContentLoading,
    error: pageContentError,
  } = usePageContent();

  const copy = pageContent.home || {};

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

    return () => {
  controller.abort();
  clearProcessBodyBackground();
};
  }, []);

  if (status === "loading" || pageContentLoading) {
    return (
      <section className="page-state">
        <span>{copy.loadingKicker || "YÇ / Loading"}</span>
        <p>{copy.loadingText || "Portfolio hazırlanıyor."}</p>
      </section>
    );
  }

  if (status === "error" || pageContentError || !home) {
    return (
      <section className="page-state">
        <span>{copy.errorKicker || "Connection error"}</span>
        <h1>{copy.errorTitle || "İçerik yüklenemedi."}</h1>
        <p>
          {copy.errorDescription ||
            "Backend sunucusunun çalıştığından emin olun."}
        </p>
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


const advertisingPortfolio = mergeAdvertisingPortfolio(
  home.advertisingPortfolio
);

const advertisingProjects = [...advertisingPortfolio.projects]
  .filter((project) => project.isVisible !== false)
  .sort((a, b) => a.order - b.order);

return (
  <>
    <Seo
  title={home.seo?.title}
  description={home.seo?.description}
  image={home.featuredMedia?.url}
  schemaType="WebSite"
/>
    {sectionIsVisible("hero") && (
        <section className="showcase">
         <div className="showcase__canvas">
  <div
    className="showcase-hover-border"
    aria-hidden="true"
  />

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

  <BrandName
  as="h1"
  name={settings.brand?.name}
/>

<a
  className="showcase__portrait"
  href="https://github.com/yunuscecen"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Yunus Çeçen GitHub profilini yeni sekmede aç"
  title="GitHub profilini aç"
>
  <img
    src="/yunuscecen.jpeg"
    alt="Yunus Çeçen"
    width="96"
    height="96"
  />

  <span
    className="showcase__portrait-link-indicator"
    aria-hidden="true"
  >
    <SiGithub />
  </span>
</a>

<nav
  className="showcase__socials notranslate"
  aria-label="Profesyonel profiller"
  translate="no"
>
  {heroSocialLinks.map(
    ({ name, url, className, Icon }) => (
      <a
        className={`showcase__social-link ${className}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} profilini yeni sekmede aç`}
        key={name}
      >
        <Icon aria-hidden="true" />

        <span className="showcase__social-tooltip">
          {name}
        </span>
      </a>
    )
  )}
</nav>

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
              {copy.coordinateLeft}
            </span>

            <span className="showcase__coordinate showcase__coordinate--right">
              {copy.coordinateRight}
            </span>
          </div>

          <aside className="showcase__rail">
 {(copy.railItems || []).map((item, index) => (
  <article key={`${item.eyebrow}-${index}`}>
    <div
      className="showcase-hover-border"
      aria-hidden="true"
    />

    <span>{item.eyebrow}</span>
      <h2>{item.title}</h2>
      <p>{item.description}</p>
    </article>
  ))}
</aside>
        </section>
      )}
      <section
        className="technology-rail"
        aria-label="Kullandığım teknolojiler ve tasarım araçları"
      >
        <div className="technology-rail__heading">
          <span>Stack / Tools</span>

          <p>
            Development
            <br />
            × Creative
          </p>
        </div>

        <div className="technology-rail__logos">
          {technologyLogos.map(
  ({ name, category, description, Icon }, index) => {
    const tooltipId = `technology-tooltip-${index}`;

    return (
      <div
        className="technology-logo"
        key={name}
        tabIndex={0}
        aria-describedby={tooltipId}
      >
        <Icon aria-hidden="true" />

        <div className="technology-logo__content">
          <strong>{name}</strong>
          <span>{category}</span>
        </div>

        <div
          className="technology-logo__tooltip"
          id={tooltipId}
          role="tooltip"
        >
          
          <p>{description}</p>
        </div>
      </div>
    );
  }
)}
        </div>
      </section>

      <section className="manifesto">
        <p className="section-kicker">{copy.manifestoKicker}</p>

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

      <section className="home-feature-media">
        <ManagedImage
          src={home.featuredMedia?.url}
          alt={home.featuredMedia?.alt}
          label={copy.featuredImageLabel}
          badge={copy.featuredImageBadge}
          loading="eager"
        />

        <div className="home-feature-media__caption">
          <span>
            {home.featuredMedia?.caption ||
              copy.featuredImageFallbackCaption}
          </span>

          <span>{copy.featuredImageRecommendation}</span>
        </div>
      </section>
    

      {sectionIsVisible("projects") && featuredProject && (
        <section className="projects-showcase">
          <header className="content-heading">
            <div>
              <p className="section-kicker">
                {copy.projectsSectionNumber} /{" "}
                {home.projectsIntro?.eyebrow}
              </p>

              <h2>{home.projectsIntro?.title}</h2>
            </div>

            <div>
              <p>{home.projectsIntro?.description}</p>

              <Link className="inline-link" to="/projeler">
                {copy.allProjectsLabel}
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
                {copy.servicesSectionNumber} /{" "}
                {home.servicesIntro?.eyebrow}
              </p>

              <h2>{home.servicesIntro?.title}</h2>
            </div>

            <p>{home.servicesIntro?.description}</p>
          </header>

          <div className="service-grid">
            {services.map((service, index) => {
              const Icon =
                serviceIcons[index % serviceIcons.length];

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
              {copy.processSectionNumber} /{" "}
              {home.processIntro?.eyebrow}
            </p>

            <h2>{home.processIntro?.title}</h2>

            {home.processIntro?.description && (
              <p>{home.processIntro.description}</p>
            )}
          </header>

          <div className="process-grid">
            {[...(home.processSteps || [])]
              .sort((a, b) => a.order - b.order)
              .map((step, index) => (
  <article
    key={step._id || step.number}
    style={{
      "--process-hue": `${(212 + index * 43) % 360}`,
      "--process-hue-alt": `${(258 + index * 43) % 360}`,
    }}
    onMouseEnter={() =>
      activateProcessBodyBackground(index)
    }
    onMouseLeave={clearProcessBodyBackground}
  >
    <span>{step.number}</span>
    <h3>{step.title}</h3>
    <p>{step.description}</p>
  </article>
))}
          </div>
        </section>
      )}
  {advertisingPortfolio.isVisible &&
        advertisingProjects.length > 0 && (
          <section className="adfolio-preview">
            <div
              className="adfolio-preview__glow"
              aria-hidden="true"
            />

            <header className="adfolio-preview__header">
              <div>
                <p className="section-kicker">
                  {advertisingPortfolio.eyebrow}
                </p>

                <h2>{advertisingPortfolio.title}</h2>
              </div>

              <div>
                <p>{advertisingPortfolio.description}</p>

                <Link
                  className="inline-link"
                  to="/reklam-tasarimlari"
                >
                  {advertisingPortfolio.buttonLabel}
                  <ArrowRight size={17} />
                </Link>
              </div>
            </header>

            <div className="adfolio-preview__grid">
              {advertisingProjects.slice(0, 2).map(
                (project, index) => (
                  <Link
                    className="adfolio-card"
                    to="/reklam-tasarimlari"
                    key={project.projectId}
                  >
                    <img
                      src={project.coverUrl}
                      alt={`${project.title} kapak görseli`}
                      loading={index === 0 ? "eager" : "lazy"}
                    />

                    <div className="adfolio-card__overlay">
                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <p>Behance collection</p>
                        <h3>{project.title}</h3>
                      </div>

                      <ArrowUpRight aria-hidden="true" />
                    </div>
                  </Link>
                )
              )}
            </div>
          </section>
        )}
      {sectionIsVisible("about") && (
        <section className="about-feature">
          <div
            className="about-feature__field"
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>

          <div className="about-feature__content">
            <p className="section-kicker">{copy.aboutKicker}</p>
            <h2>{home.aboutPreview?.title}</h2>
            <p>{home.aboutPreview?.description}</p>

            <Link className="light-button" to="/hakkimda">
              {copy.aboutButtonLabel}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

export default HomePage;