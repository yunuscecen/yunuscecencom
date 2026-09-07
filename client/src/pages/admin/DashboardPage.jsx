import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FolderKanban,
  Image,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

import http from "../../api/http";

const categoryLabels = {
  "web-development": "Web Development",
  wordpress: "WordPress",
  "ui-ux": "UI / UX",
  "graphic-design": "Graphic Design",
  branding: "Branding",
  other: "Diğer",
};

const serviceLabels = {
  "web-development": "Web Development",
  wordpress: "WordPress",
  "ui-ux": "UI / UX",
  "graphic-design": "Graphic Design",
  branding: "Branding",
  other: "Diğer",
  "": "Belirtilmedi",
};

const statusLabels = {
  new: "Yeni",
  read: "Okundu",
  replied: "Yanıtlandı",
  archived: "Arşivlendi",
};

const emptyDashboard = {
  projects: {
    total: 0,
    published: 0,
    featured: 0,
    draft: 0,
  },

  services: {
    total: 0,
    published: 0,
    draft: 0,
  },

  messages: {
    total: 0,
    new: 0,
    replied: 0,
  },

  media: {
    total: 0,
    available: true,
  },

  recentProjects: [],
  recentMessages: [],
};

const extractData = (response) =>
  response.data?.data || response.data;

const formatDate = (value) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const DashboardPage = () => {
  const [dashboard, setDashboard] =
    useState(emptyDashboard);

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setStatus("loading");
      setError("");

      const response = await http.get(
        "/admin/dashboard"
      );

      setDashboard({
        ...emptyDashboard,
        ...extractData(response),

        projects: {
          ...emptyDashboard.projects,
          ...extractData(response)?.projects,
        },

        services: {
          ...emptyDashboard.services,
          ...extractData(response)?.services,
        },

        messages: {
          ...emptyDashboard.messages,
          ...extractData(response)?.messages,
        },

        media: {
          ...emptyDashboard.media,
          ...extractData(response)?.media,
        },

        recentProjects:
          extractData(response)?.recentProjects || [],

        recentMessages:
          extractData(response)?.recentMessages || [],
      });

      setStatus("success");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Dashboard bilgileri alınamadı."
      );

      setStatus("error");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const metricCards = [
    {
      label: "Toplam proje",
      value: dashboard.projects.total,
      detail: `${dashboard.projects.published} yayında · ${dashboard.projects.draft} taslak`,
      to: "/admin/projects",
      icon: FolderKanban,
      tone: "blue",
    },
    {
      label: "Hizmetler",
      value: dashboard.services.total,
      detail: `${dashboard.services.published} yayında · ${dashboard.services.draft} taslak`,
      to: "/admin/services",
      icon: BriefcaseBusiness,
      tone: "violet",
    },
    {
      label: "Yeni mesaj",
      value: dashboard.messages.new,
      detail: `${dashboard.messages.total} toplam · ${dashboard.messages.replied} yanıtlandı`,
      to: "/admin/messages",
      icon: MessageSquare,
      tone: "cyan",
    },
    {
      label: "Medya",
      value: dashboard.media.available
        ? dashboard.media.total
        : "—",
      detail: dashboard.media.available
        ? "Cloudinary arşivindeki görseller"
        : "Medya sayısı alınamadı",
      to: "/admin/media",
      icon: Image,
      tone: "slate",
    },
  ];

  if (status === "loading") {
    return (
      <section className="admin-page-state">
        <span>Dashboard hazırlanıyor...</span>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="admin-dashboard-error">
        <span>Dashboard / Error</span>
        <h1>Veriler alınamadı.</h1>
        <p>{error}</p>

        <button
          className="admin-primary-button"
          type="button"
          onClick={loadDashboard}
        >
          Tekrar dene
        </button>
      </section>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-editor-header">
        <div>
          <span className="admin-editor-eyebrow">
            Genel bakış
          </span>

          <h1>Dashboard</h1>

          <p>
            İçeriklerin, projelerin ve yeni taleplerin güncel
            özeti.
          </p>
        </div>

        <a
          className="admin-secondary-button admin-preview-link"
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          Siteyi görüntüle
          <ArrowUpRight size={16} />
        </a>
      </header>

      <section className="admin-dashboard-metrics">
        {metricCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              className={`admin-metric-card admin-metric-card--${card.tone}`}
              to={card.to}
              key={card.label}
            >
              <div className="admin-metric-card__top">
                <span>{card.label}</span>
                <Icon size={18} aria-hidden="true" />
              </div>

              <strong>{card.value}</strong>
              <p>{card.detail}</p>

              <span className="admin-metric-card__link">
                Yönet
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                />
              </span>
            </Link>
          );
        })}
      </section>

      <div className="admin-dashboard-content">
        <section className="admin-dashboard-panel">
          <header className="admin-dashboard-panel__heading">
            <div>
              <span>Portfolio</span>
              <h2>Son güncellenen projeler</h2>
            </div>

            <Link to="/admin/projects">
              Tüm projeler
              <ArrowUpRight size={14} />
            </Link>
          </header>

          {dashboard.recentProjects.length === 0 ? (
            <div className="admin-dashboard-empty">
              Henüz proje bulunmuyor.
            </div>
          ) : (
            <div className="admin-dashboard-projects">
              {dashboard.recentProjects.map((project) => (
                <Link
                  to="/admin/projects"
                  key={project._id}
                >
                  <div className="admin-dashboard-projects__image">
                    {project.coverImage?.url ? (
                      <img
                        src={project.coverImage.url}
                        alt={project.coverImage.alt || ""}
                      />
                    ) : (
                      <span>Project</span>
                    )}
                  </div>

                  <div>
                    <span>
                      {categoryLabels[project.category] ||
                        project.category}
                    </span>

                    <h3>{project.title}</h3>

                    <p>
                      {formatDate(project.updatedAt)}
                    </p>
                  </div>

                  <div className="admin-dashboard-projects__status">
                    {project.featured && (
                      <span>Öne çıkan</span>
                    )}

                    <span
                      className={
                        project.published
                          ? "is-published"
                          : "is-draft"
                      }
                    >
                      {project.published
                        ? "Yayında"
                        : "Taslak"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="admin-dashboard-panel">
          <header className="admin-dashboard-panel__heading">
            <div>
              <span>Inbox</span>
              <h2>Son mesajlar</h2>
            </div>

            <Link to="/admin/messages">
              Gelen kutusu
              <ArrowUpRight size={14} />
            </Link>
          </header>

          {dashboard.recentMessages.length === 0 ? (
            <div className="admin-dashboard-empty">
              Henüz mesaj bulunmuyor.
            </div>
          ) : (
            <div className="admin-dashboard-messages">
              {dashboard.recentMessages.map((message) => (
                <Link
                  to="/admin/messages"
                  className={
                    message.status === "new"
                      ? "is-unread"
                      : ""
                  }
                  key={message._id}
                >
                  <div className="admin-dashboard-message-avatar">
                    {message.name
                      ?.trim()
                      .charAt(0)
                      .toLocaleUpperCase("tr-TR")}
                  </div>

                  <div>
                    <div>
                      <h3>{message.name}</h3>

                      <time>
                        {formatDate(message.createdAt)}
                      </time>
                    </div>

                    <span>{message.email}</span>
                    <p>{message.message}</p>

                    <footer>
                      <span>
                        {serviceLabels[message.service] ||
                          "Belirtilmedi"}
                      </span>

                      <span
                        className={`admin-message-status admin-message-status--${message.status}`}
                      >
                        {statusLabels[message.status]}
                      </span>
                    </footer>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="admin-quick-actions">
        <div>
          <span className="admin-editor-eyebrow">
            Hızlı işlemler
          </span>

          <h2>İçerik yönetimine devam et.</h2>
        </div>

        <nav>
          <Link to="/admin/projects">
            Yeni proje
          </Link>

          <Link to="/admin/services">
            Yeni hizmet
          </Link>

          <Link to="/admin/home">
            Ana sayfayı düzenle
          </Link>

          <Link to="/admin/settings">
            Site ayarları
          </Link>
        </nav>
      </section>
    </div>
  );
};

export default DashboardPage;