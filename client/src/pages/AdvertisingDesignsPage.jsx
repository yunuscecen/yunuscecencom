import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import http from "../api/http";
import Seo from "../components/Seo";
import { mergeAdvertisingPortfolio } from "../data/advertisingPortfolio";

const AdvertisingDesignsPage = () => {
  const [home, setHome] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    const loadPortfolio = async () => {
      try {
        const response = await http.get("/content/home", {
          signal: controller.signal,
        });

        setHome(response.data.data);
        setStatus("success");
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error(error);
          setStatus("error");
        }
      }
    };

    loadPortfolio();

    return () => controller.abort();
  }, []);

  if (status === "loading") {
    return (
      <section className="page-state">
        <span>AdFolio / Loading</span>
        <p>Reklam tasarımları hazırlanıyor.</p>
      </section>
    );
  }

  if (status === "error" || !home) {
    return (
      <section className="page-state">
        <span>Connection error</span>
        <h1>Reklam tasarımları yüklenemedi.</h1>
        <p>Lütfen biraz sonra tekrar deneyin.</p>
      </section>
    );
  }

  const portfolio = mergeAdvertisingPortfolio(
    home.advertisingPortfolio
  );

  const visibleProjects = [...portfolio.projects]
    .filter((project) => project.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="advertising-page">
      <Seo
        title={portfolio.seo?.title}
        description={portfolio.seo?.description}
        image={visibleProjects[0]?.coverUrl}
      />

      <header className="advertising-page__hero">
        <p className="section-kicker">{portfolio.pageKicker}</p>

        <div>
          <h1>{portfolio.pageTitle}</h1>
          <p>{portfolio.pageDescription}</p>
        </div>

        <span>
          {String(visibleProjects.length).padStart(2, "0")} koleksiyon
        </span>
            </header>

      <section
        className="advertising-scope-note"
        aria-labelledby="advertising-scope-title"
      >
        <div className="advertising-scope-note__meta">
          <span>Scope / Creative</span>

          <p>
            <span aria-hidden="true" />
            Görsel üretim odağı
          </p>
        </div>

        <div className="advertising-scope-note__content">
          <h2 id="advertising-scope-title">
            Reklam iletişiminin görsel üretim tarafına
            odaklanıyorum.
          </h2>

          <div>
            <p>
              Markanızın hedefleri, iletişim dili ve kampanya
              brief’i doğrultusunda dijital reklam ve sosyal
              medya görselleri tasarlıyorum.
            </p>

            <p>
              Çalışma kapsamım reklam yönetiminden ziyade
              kreatif üretime odaklanır. Medya planlama, reklam
              hesabı kurulumu, bütçe yönetimi ve kampanya
              optimizasyonu hizmet kapsamımda yer almaz.
              Gerektiğinde markanızın pazarlama ekibi veya
              çalıştığı ajansla koordineli şekilde ilerleyebilirim.
            </p>
          </div>
        </div>
      </section>

      {visibleProjects.length === 0 ? (
        <section className="catalog-state">
          <p>Henüz yayınlanan reklam tasarımı bulunmuyor.</p>
        </section>
      ) : (
        <section className="behance-grid">
          {visibleProjects.map((project, index) => (
            <article
              className="behance-grid-card"
              key={project.projectId}
            >
              <header className="behance-grid-card__header">
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <p>Behance collection</p>
                  <h2>{project.title}</h2>
                </div>
              </header>

              <div className="behance-grid-card__frame">
                <iframe
                  src={project.embedUrl}
                  title={`${project.title} Behance projesi`}
                  loading="lazy"
                  frameBorder="0"
                  allow="clipboard-write"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              <footer className="behance-grid-card__footer">
                <p>İçerik doğrudan Behance üzerinden gösteriliyor.</p>

                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Behance’te incele
                  <ArrowUpRight size={17} />
                </a>
              </footer>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default AdvertisingDesignsPage;