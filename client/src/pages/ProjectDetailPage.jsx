import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import http from "../api/http";

const categoryLabels = {
  "web-development": "Web Development",
  wordpress: "WordPress",
  "ui-ux": "UI / UX",
  "graphic-design": "Graphic Design",
  branding: "Branding",
  other: "Other",
};

const ProjectDetailPage = () => {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    const loadProject = async () => {
      setStatus("loading");

      try {
        const response = await http.get(`/projects/${slug}`, {
          signal: controller.signal,
        });

        setProject(response.data.data);
        setStatus("success");
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error(error);
          setStatus(
            error.response?.status === 404 ? "not-found" : "error"
          );
        }
      }
    };

    loadProject();

    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (!project) {
      return undefined;
    }

    const previousTitle = document.title;

    document.title =
      project.seo?.title ||
      `${project.title} | Yunus Çeçen`;

    return () => {
      document.title = previousTitle;
    };
  }, [project]);

  if (status === "loading") {
    return (
      <section className="page-state">
        <span>Project / Loading</span>
        <p>Proje yükleniyor.</p>
      </section>
    );
  }

  if (status === "error" || status === "not-found" || !project) {
    return (
      <section className="page-state">
        <span>{status === "not-found" ? "404" : "Error"}</span>
        <h1>
          {status === "not-found"
            ? "Proje bulunamadı."
            : "Proje yüklenemedi."}
        </h1>

        <Link className="light-button" to="/projeler">
          Projelere dön
        </Link>
      </section>
    );
  }

  const externalLinks = [
    {
      label: "Canlı proje",
      url: project.links?.live,
    },
    {
      label: "GitHub",
      url: project.links?.github,
    },
    {
      label: "Behance",
      url: project.links?.behance,
    },
  ].filter((item) => item.url);

  return (
    <article className="project-detail">
      <header className="project-detail__hero">
        <Link className="back-link" to="/projeler">
          <ArrowLeft size={16} />
          Tüm projeler
        </Link>

        <div>
          <p className="section-kicker">
            {categoryLabels[project.category] || project.category}
          </p>

          <h1>{project.title}</h1>
          <p>{project.shortDescription}</p>
        </div>

        <span className="project-detail__year">
          {project.year || "Selected work"}
        </span>
      </header>

      <div className="project-detail__cover">
        <img
          src={project.coverImage?.url}
          alt={project.coverImage?.alt}
        />
      </div>

      <section className="project-facts">
        {project.client && (
          <div>
            <span>Client</span>
            <p>{project.client}</p>
          </div>
        )}

        {project.year && (
          <div>
            <span>Year</span>
            <p>{project.year}</p>
          </div>
        )}

        {project.services?.length > 0 && (
          <div>
            <span>Services</span>
            <p>{project.services.join(", ")}</p>
          </div>
        )}

        {project.technologies?.length > 0 && (
          <div>
            <span>Technology</span>
            <p>{project.technologies.join(", ")}</p>
          </div>
        )}
      </section>

      {project.description?.length > 0 && (
        <section className="project-narrative">
          <p className="section-kicker">Project overview</p>

          <div>
            {project.description.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 20)}-${index}`}>
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {(project.challenge || project.solution) && (
        <section className="project-case-grid">
          {project.challenge && (
            <article>
              <span>01 / Challenge</span>
              <h2>Problem</h2>
              <p>{project.challenge}</p>
            </article>
          )}

          {project.solution && (
            <article>
              <span>02 / Solution</span>
              <h2>Yaklaşım</h2>
              <p>{project.solution}</p>
            </article>
          )}
        </section>
      )}

      {project.gallery?.length > 0 && (
        <section className="project-gallery">
          {project.gallery.map((image, index) => (
            <figure key={image._id || `${image.url}-${index}`}>
              <img
                src={image.url}
                alt={image.alt}
                loading="lazy"
              />

              <figcaption>
                {String(index + 1).padStart(2, "0")} / Project image
              </figcaption>
            </figure>
          ))}
        </section>
      )}

      {project.results?.length > 0 && (
        <section className="project-results">
          <p className="section-kicker">03 / Results</p>

          <div>
            <h2>Ortaya çıkan sonuçlar</h2>

            <ul>
              {project.results.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {externalLinks.length > 0 && (
        <section className="project-links">
          <p>Projeyi görüntüle</p>

          <div>
            {externalLinks.map((link) => (
              <a
                className="light-button"
                href={link.url}
                target="_blank"
                rel="noreferrer"
                key={link.label}
              >
                {link.label}
                <ArrowUpRight size={15} />
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export default ProjectDetailPage;