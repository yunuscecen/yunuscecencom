import {
  ArrowUpRight,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";

import Seo from "../components/Seo";

const capabilities = [
  {
    number: "01",
    title: "Web uygulamaları",
    description:
      "MERN ve TypeScript kullanarak yönetilebilir, ölçeklenebilir ve farklı ekranlarda sorunsuz çalışan web çözümleri geliştiriyorum.",
  },
  {
    number: "02",
    title: "WordPress çözümleri",
    description:
      "İçeriklerin teknik desteğe ihtiyaç duyulmadan güncellenebildiği, markaya özel ve kullanımı kolay kurumsal siteler hazırlıyorum.",
  },
  {
    number: "03",
    title: "Arayüz ve deneyim tasarımı",
    description:
      "Karmaşık ihtiyaçları anlaşılır kullanıcı akışlarına, tutarlı bileşenlere ve geliştirilmeye hazır Figma tasarımlarına dönüştürüyorum.",
  },
  {
    number: "04",
    title: "Görsel iletişim",
    description:
      "Markanın mesajını doğru hiyerarşiyle aktaran reklam kreatifleri, sosyal medya tasarımları ve görsel sistemler hazırlıyorum.",
  },
];

const skillGroups = [
  {
    title: "Development",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST API",
      "MERN Stack",
    ],
  },
  {
    title: "Web Solutions",
    skills: [
      "WordPress",
      "Responsive Design",
      "İçerik Yönetimi",
      "SEO Temelleri",
      "Performans",
      "Erişilebilirlik",
    ],
  },
  {
    title: "Design",
    skills: [
      "Figma",
      "Photoshop",
      "Illustrator",
      "UI / UX",
      "Grafik Tasarım",
      "Reklam Tasarımı",
    ],
  },
];

const workingPrinciples = [
  "İhtiyacı ve projenin gerçek hedefini anlamak",
  "Gereksiz karmaşıklığı azaltarak net bir kapsam oluşturmak",
  "Teknik ve görsel kararları aynı sistem içerisinde ele almak",
  "Süreç boyunca açık, düzenli ve anlaşılır iletişim kurmak",
  "Teslim sonrasında sürdürülebilir bir yapı bırakmak",
];

const profileLinks = [
  {
    label: "GitHub",
    url: "https://github.com/yunuscecen",
  },
  {
    label: "Behance",
    url: "https://www.behance.net/yunusccn",
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/yunuscecen/",
  },
  {
    label: "Upwork",
    url: "https://www.upwork.com/freelancers/~0197449027a5bf721f?viewMode=1",
  },
];

const CvPage = () => {
  return (
    <div className="cv-page">
      <Seo
        title="CV"
        description="Yunus Çeçen — Yazılım geliştirici ve tasarımcı özgeçmişi, yetkinlikleri ve çalışma alanları."
        type="profile"
        schemaType="Person"
      />

      <header className="cv-page__hero">
        <div className="cv-page__hero-content">
          <p className="section-kicker">
            Curriculum Vitae / Profile
          </p>

          <h1>
            Teknik üretim ile görsel düşünceyi aynı
            projede buluşturuyorum.
          </h1>

          <p>
            Web geliştirme, arayüz tasarımı ve görsel
            iletişim becerilerimi; insanların ve markaların
            ihtiyaç duyduğu anlaşılır, kullanılabilir ve
            sürdürülebilir çözümler üretmek için
            kullanıyorum.
          </p>
        </div>

        <div className="cv-page__hero-actions">
          <a
            className="light-button"
            href="/documents/Yunus-Cecen-CV.pdf"
            download="Yunus-Cecen-CV.pdf"
          >
            PDF indir
            <Download size={16} aria-hidden="true" />
          </a>

          <Link className="cv-page__contact-link" to="/iletisim">
            İletişime geç
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <article className="cv-document">
        <aside className="cv-document__sidebar">
          <div className="cv-profile">
            <div className="cv-profile__image">
              <img
                src="/yunuscecen.jpeg"
                alt="Yunus Çeçen"
              />
            </div>

            <div>
              <p>Freelance Developer & Designer</p>
              <h2>Yunus Çeçen</h2>
            </div>
          </div>

          <section className="cv-sidebar-section">
            <h3>Bilgiler</h3>

            <dl className="cv-information">
              <div>
                <dt>Konum</dt>
                <dd>Türkiye / Uzaktan</dd>
              </div>

              <div>
                <dt>Çalışma modeli</dt>
                <dd>Freelance / Proje bazlı</dd>
              </div>

              <div>
                <dt>Disiplinler</dt>
                <dd>Development & Design</dd>
              </div>
            </dl>
          </section>

          <section className="cv-sidebar-section">
            <h3>Profiller</h3>

            <nav
              className="cv-profile-links"
              aria-label="Profesyonel profiller"
            >
              {profileLinks.map((link) => (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  key={link.label}
                >
                  {link.label}
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                  />
                </a>
              ))}
            </nav>
          </section>

          <section className="cv-sidebar-section">
            <h3>Odak</h3>

            <p className="cv-sidebar-copy">
              Teknik olarak sağlam, görsel olarak tutarlı ve
              müşterinin sonradan yönetebileceği dijital
              sistemler oluşturmak.
            </p>
          </section>
        </aside>

        <div className="cv-document__main">
          <section className="cv-section">
            <div className="cv-section__heading">
              <span>01</span>
              <h2>Profil</h2>
            </div>

            <div className="cv-profile-copy">
              <p>
                Yazılım ve tasarımı birbirinden bağımsız
                teslimler olarak değil, aynı dijital
                deneyimin parçaları olarak ele alıyorum.
                Projenin ihtiyacını sadeleştiriyor,
                uygulanabilir bir kapsam oluşturuyor ve
                üretim sürecini baştan sona tutarlı biçimde
                yürütüyorum.
              </p>

              <p>
                Amacım yalnızca çalışan veya güzel görünen
                bir çıktı hazırlamak değil; kullanıcı için
                anlaşılır, işletme için yönetilebilir ve
                gelecekte geliştirilebilir bir çözüm
                oluşturmaktır.
              </p>
            </div>
          </section>

          <section className="cv-section">
            <div className="cv-section__heading">
              <span>02</span>
              <h2>Çözüm alanları</h2>
            </div>

            <div className="cv-capabilities">
              {capabilities.map((capability) => (
                <article key={capability.number}>
                  <span>{capability.number}</span>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="cv-section">
            <div className="cv-section__heading">
              <span>03</span>
              <h2>Yetkinlikler</h2>
            </div>

            <div className="cv-skills">
              {skillGroups.map((group) => (
                <article key={group.title}>
                  <h3>{group.title}</h3>

                  <ul>
                    {group.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="cv-section">
            <div className="cv-section__heading">
              <span>04</span>
              <h2>Çalışma yaklaşımı</h2>
            </div>

            <ol className="cv-principles">
              {workingPrinciples.map((principle, index) => (
                <li key={principle}>
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p>{principle}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="cv-scope-note">
            <span>Reklam tasarımı kapsamı</span>

            <p>
              Reklam kampanyalarının yönetimini değil;
              markanın kampanyalarda ihtiyaç duyduğu reklam
              ve sosyal medya kreatiflerinin görsel tasarım
              sürecini üstleniyorum.
            </p>
          </section>

          <footer className="cv-document__footer">
            <div>
              <span>Yeni bir proje mi planlıyorsunuz?</span>

              <h2>
                İhtiyacı birlikte netleştirip doğru çözümü
                oluşturalım.
              </h2>
            </div>

            <Link className="light-button" to="/iletisim">
              Projenizi konuşalım
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </footer>
        </div>
      </article>
    </div>
  );
};

export default CvPage;