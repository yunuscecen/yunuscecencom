import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import http from "../api/http";

const categoryLabels = {
  "web-development": "Web Development",
  wordpress: "WordPress",
  "ui-ux": "UI / UX",
  "graphic-design": "Graphic Design",
  branding: "Branding",
  other: "Other",
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    const loadProjects = async () => {
      try {
        const response = await http.get("/projects?limit=50", {
          signal: controller.signal,
        });

        setProjects(response.data.data);
        setStatus("success");
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error(error);
          setStatus("error");
        }
      }
    };

    loadProjects();

    return () => controller.abort();
  }, []);

  return (
    <div className="projects-page">
      <header className="projects-page__hero">
        <p className="section-kicker">Selected work / 01</p>

        <div>
          <h1>Projeler</h1>
          <p>
            Yazılım geliştirme, dijital ürün tasarımı ve görsel
            iletişimin kesişimindeki seçili çalışmalar.
          </p>
        </div>

        <span>
          {status === "success"
            ? `${String(projects.length).padStart(2, "0")} proje`
            : "Yükleniyor"}
        </span>
      </header>

      {status === "loading" && (
        <section className="catalog-state">
          <span />
          <p>Projeler yükleniyor.</p>
        </section>
      )}

      {status === "error" && (
        <section className="catalog-state">
          <p>Projeler şu anda yüklenemiyor.</p>
        </section>
      )}

      {status === "success" && projects.length === 0 && (
        <section className="empty-projects">
          <div className="empty-projects__visual" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <p className="section-kicker">Archive / Empty</p>
          <h2>Seçili projeler hazırlanıyor.</h2>
          <p>
            Geliştirme ve tasarım çalışmalarından oluşan proje
            arşivi yakında burada yer alacak.
          </p>
        </section>
      )}

      {status === "success" && projects.length > 0 && (
        <section className="project-catalog">
          {projects.map((project, index) => (
            <Link
              className="catalog-card"
              to={`/projeler/${project.slug}`}
              key={project._id}
            >
              <div className="catalog-card__image">
                <img
                  src={project.coverImage?.url}
                  alt={project.coverImage?.alt}
                  loading={index > 1 ? "lazy" : "eager"}
                />

                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="catalog-card__heading">
                <div>
                  <p>
                    {categoryLabels[project.category] ||
                      project.category}
                  </p>
                  <h2>{project.title}</h2>
                </div>

                <ArrowUpRight aria-hidden="true" />
              </div>

              <p className="catalog-card__description">
                {project.shortDescription}
              </p>

              <div className="catalog-card__tools">
                {project.technologies?.slice(0, 4).map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
};

export default ProjectsPage;