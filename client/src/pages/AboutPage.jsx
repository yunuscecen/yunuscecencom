import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import http from "../api/http";
import { useSiteSettings } from "../context/SiteContext";

const AboutPage = () => {
  const { settings } = useSiteSettings();
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

  if (status === "loading") {
    return (
      <section className="page-state">
        <span>About / Loading</span>
        <p>İçerik yükleniyor.</p>
      </section>
    );
  }

  if (status === "error" || !about) {
    return (
      <section className="page-state">
        <span>Connection error</span>
        <h1>Hakkımda içeriği yüklenemedi.</h1>
      </section>
    );
  }

  return (
    <div className="about-page">
      <header className="about-page__hero">
        <p className="section-kicker">About / Profile</p>

        <div className="about-page__heading">
          <h1>{about.title}</h1>
          <p>{about.introduction}</p>
        </div>

        <div className="about-portrait">
          {about.profileImage?.url ? (
            <img
              src={about.profileImage.url}
              alt={about.profileImage.alt || settings.brand?.name}
            />
          ) : (
            <>
              <div className="about-portrait__field" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className="about-portrait__identity">
                <strong>{settings.brand?.shortName}</strong>
                <span>Development × Design</span>
              </div>
            </>
          )}
        </div>
      </header>

      <section className="about-story">
        <p className="section-kicker">01 / Story</p>

        <div>
          {about.story?.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 20)}-${index}`}>
              {paragraph}
            </p>
          ))}
        </div>

        <aside>
          <span>Role</span>
          <p>{settings.brand?.profession}</p>

          <span>Location</span>
          <p>{settings.contact?.location}</p>

          <span>Status</span>
          <p>{settings.contact?.availabilityText}</p>
        </aside>
      </section>

      {about.skillGroups?.length > 0 && (
        <section className="about-skills">
          <header>
            <p className="section-kicker">02 / Capabilities</p>
            <h2>Teknik düşünce ve görsel üretim aynı sistemde.</h2>
          </header>

          <div className="skill-groups">
            {[...about.skillGroups]
              .sort((a, b) => a.order - b.order)
              .map((group, groupIndex) => (
                <article key={group._id || group.title}>
                  <span>
                    {String(groupIndex + 1).padStart(2, "0")}
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
            <p className="section-kicker">03 / Experience</p>
            <h2>Deneyim</h2>
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
          <p className="section-kicker">Next / Contact</p>
          <h2>Birlikte yeni bir şey üretelim.</h2>
        </div>

        <Link className="light-button" to="/iletisim">
          İletişime geç
          <ArrowUpRight size={15} />
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;