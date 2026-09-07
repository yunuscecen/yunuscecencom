import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import http from "../api/http";
import { usePageContent } from "../context/PageContentContext";
import Seo from "../components/Seo";
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
  

  const {
    content: pageContent,
    loading: pageContentLoading,
    error: pageContentError,
  } = usePageContent();

  const copy = pageContent.projectDetail || {};

  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    const loadProject = async () => {
      setStatus("loading");

      try {
        const response = await http.get(
          `/projects/${slug}`,
          {
            signal: controller.signal,
          }
        );

        setProject(response.data.data);
        setStatus("success");
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error(error);

          setStatus(
            error.response?.status === 404
              ? "not-found"
              : "error"
          );
        }
      }
    };

    loadProject();

    return () => controller.abort();
  }, [slug]);



  if (status === "loading" || pageContentLoading) {
    return (
      <section className="page-state">
        <span>Project / Loading</span>
        <p>Proje yükleniyor.</p>
      </section>
    );
  }

  if (
    status === "error" ||
    status === "not-found" ||
    pageContentError ||
    !project
  ) {
    const notFound = status === "not-found";

    return (
      <section className="page-state">
        <span>{notFound ? "404" : "Error"}</span>

        <h1>
          {notFound
            ? "Proje bulunamadı."
            : "Proje yüklenemedi."}
        </h1>

        <Link className="light-button" to="/projeler">
          {copy.backLabel || "Projelere dön"}
        </Link>
      </section>
    );
  }

  const externalLinks = [
    {
      label: copy.liveLinkLabel,
      url: project.links?.live,
    },
    {
      label: copy.githubLinkLabel,
      url: project.links?.github,
    },
    {
      label: copy.behanceLinkLabel,
      url: project.links?.behance,
    },
  ].filter((item) => item.url);

  return (
   <article className="project-detail">
  <Seo
    title={project.seo?.title || project.title}
    description={
      project.seo?.description ||
      project.shortDescription
    }
    image={project.coverImage?.url}
    type="article"
  />
      <header className="project-detail__hero">
        <Link className="back-link" to="/projeler">
          <ArrowLeft size={16} />
          {copy.backLabel}
        </Link>

        <div>
          <p className="section-kicker">
            {categoryLabels[project.category] ||
              project.category}
          </p>

          <h1>{project.title}</h1>
          <p>{project.shortDescription}</p>
        </div>

        {project.year && (
          <span className="project-detail__year">
            {project.year}
          </span>
        )}
      </header>

      <div className="project-detail__cover">
        <img
          src={project.coverImage?.url}
          alt={
            project.coverImage?.alt || project.title
          }
        />
      </div>

      <section className="project-facts">
        {project.client && (
          <div>
            <span>{copy.clientLabel}</span>
            <p>{project.client}</p>
          </div>
        )}

        {project.year && (
          <div>
            <span>{copy.yearLabel}</span>
            <p>{project.year}</p>
          </div>
        )}

        {project.services?.length > 0 && (
          <div>
            <span>{copy.servicesLabel}</span>
            <p>{project.services.join(", ")}</p>
          </div>
        )}

        {project.technologies?.length > 0 && (
          <div>
            <span>{copy.technologyLabel}</span>
            <p>{project.technologies.join(", ")}</p>
          </div>
        )}
      </section>

      {project.description?.length > 0 && (
        <section className="project-narrative">
          <p className="section-kicker">
            {copy.overviewKicker}
          </p>

          <div>
            {project.description.map(
              (paragraph, index) => (
                <p
                  key={`${paragraph.slice(0, 20)}-${index}`}
                >
                  {paragraph}
                </p>
              )
            )}
          </div>
        </section>
      )}

      {(project.challenge || project.solution) && (
        <section className="project-case-grid">
          {project.challenge && (
            <article>
              <span>{copy.challengeKicker}</span>
              <h2>{copy.challengeTitle}</h2>
              <p>{project.challenge}</p>
            </article>
          )}

          {project.solution && (
            <article>
              <span>{copy.solutionKicker}</span>
              <h2>{copy.solutionTitle}</h2>
              <p>{project.solution}</p>
            </article>
          )}
        </section>
      )}

      {project.gallery?.length > 0 && (
        <section className="project-gallery">
          {project.gallery.map((image, index) => (
            <figure
              key={image._id || `${image.url}-${index}`}
            >
              <img
                src={image.url}
                alt={image.alt || project.title}
                loading="lazy"
              />

              <figcaption>
                {String(index + 1).padStart(2, "0")} /{" "}
                {copy.galleryCaption}
              </figcaption>
            </figure>
          ))}
        </section>
      )}

      {project.results?.length > 0 && (
        <section className="project-results">
          <p className="section-kicker">
            {copy.resultsKicker}
          </p>

          <div>
            <h2>{copy.resultsTitle}</h2>

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
          <p>{copy.linksTitle}</p>

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