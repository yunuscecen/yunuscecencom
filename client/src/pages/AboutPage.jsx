import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import ManagedImage from "../components/ui/ManagedImage";
import http from "../api/http";
import { usePageContent } from "../context/PageContentContext";
import { useSiteSettings } from "../context/SiteContext";
import Seo from "../components/Seo";
const AboutPage = () => {
  const { settings } = useSiteSettings();

  const {
    content: pageContent,
    loading: pageContentLoading,
    error: pageContentError,
  } = usePageContent();

  const copy = pageContent.about || {};

  const [about, setAbout] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    const loadAbout = async () => {
      try {
        const response = await http.get("/content/about", {
          signal: controller.signal,
        });

        setAbout(response.data.data);
        setStatus("success");
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error(error);
          setStatus("error");
        }
      }
    };

    loadAbout();

    return () => controller.abort();
  }, []);

  if (status === "loading" || pageContentLoading) {
    return (
      <section className="page-state">
        <span>About / Loading</span>
        <p>İçerik yükleniyor.</p>
      </section>
    );
  }

  if (
    status === "error" ||
    pageContentError ||
    !about
  ) {
    return (
      <section className="page-state">
        <span>Connection error</span>
        <h1>Hakkımda içeriği yüklenemedi.</h1>
      </section>
    );
  }

  return (
  <div className="about-page">
  <Seo
    title={about.seo?.title || "Hakkımda"}
    description={
      about.seo?.description || about.introduction
    }
    image={about.profileImage?.url}
    type="profile"
  />
      <header className="about-page__hero">
        <p className="section-kicker">
          {about.eyebrow || "About / Profile"}
        </p>

        <div className="about-page__heading">
          <h1>{about.title}</h1>
          <p>{about.introduction}</p>
        </div>

        <ManagedImage
          className="about-portrait"
          src={about.profileImage?.url}
          alt={
            about.profileImage?.alt ||
            settings.brand?.name
          }
          label="Portre görseli — 4:5"
          badge="Profile / 01"
          loading="eager"
        />
      </header>

      <section className="about-story">
        <p className="section-kicker">{copy.storyKicker}</p>

        <div>
          {about.story?.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 20)}-${index}`}>
              {paragraph}
            </p>
          ))}
        </div>

        <aside>
          <span>{copy.roleLabel}</span>
          <p>{settings.brand?.profession}</p>

          <span>{copy.locationLabel}</span>
          <p>{settings.contact?.location}</p>

          <span>{copy.statusLabel}</span>
          <p>{settings.contact?.availabilityText}</p>
        </aside>
      </section>

      {about.skillGroups?.length > 0 && (
        <section className="about-skills">
          <header>
            <p className="section-kicker">
              {copy.skillsKicker}
            </p>

            <h2>{copy.skillsTitle}</h2>
          </header>

          <div className="skill-groups">
            {[...about.skillGroups]
              .sort((a, b) => a.order - b.order)
              .map((group, groupIndex) => (
                <article key={group._id || group.title}>
                  <span>
                    {String(groupIndex + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <h3>{group.title}</h3>

                  <ul>
                    {group.items?.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
          </div>
        </section>
      )}

      {about.experience?.length > 0 && (
        <section className="experience-section">
          <header>
            <p className="section-kicker">
              {copy.experienceKicker}
            </p>

            <h2>{copy.experienceTitle}</h2>
          </header>

          <div className="experience-list">
            {[...about.experience]
              .sort((a, b) => a.order - b.order)
              .map((experience) => (
                <article key={experience._id}>
                  <div>
                    <span>
                      {experience.startDate} —{" "}
                      {experience.isCurrent
                        ? "Devam ediyor"
                        : experience.endDate}
                    </span>
                  </div>

                  <div>
                    <h3>{experience.role}</h3>
                    <p>{experience.company}</p>
                  </div>

                  <p>{experience.description}</p>
                </article>
              ))}
          </div>
        </section>
      )}

      {about.stats?.length > 0 && (
        <section className="about-stats">
          {[...about.stats]
            .sort((a, b) => a.order - b.order)
            .map((stat) => (
              <article key={stat._id}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
        </section>
      )}

      <section className="inner-cta">
        <div>
          <p className="section-kicker">
            {copy.ctaKicker}
          </p>

          <h2>{copy.ctaTitle}</h2>
        </div>

        <Link className="light-button" to="/iletisim">
          {copy.ctaButtonLabel}
          <ArrowUpRight size={15} />
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;