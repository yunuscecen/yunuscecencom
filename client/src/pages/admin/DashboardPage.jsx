import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  FolderKanban,
  MessageSquare,
} from "lucide-react";

import http from "../../api/http";
import { useAuth } from "../../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState({
    projects: 0,
    services: 0,
    messages: 0,
    recentMessages: [],
  });

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      try {
        const [
          projectsResponse,
          servicesResponse,
          messagesResponse,
        ] = await Promise.all([
          http.get("/admin/projects", {
            signal: controller.signal,
          }),
          http.get("/admin/services", {
            signal: controller.signal,
          }),
          http.get("/admin/messages?limit=4", {
            signal: controller.signal,
          }),
        ]);

        setDashboard({
          projects: projectsResponse.data.count,
          services: servicesResponse.data.count,
          messages:
            messagesResponse.data.pagination?.total || 0,
          recentMessages: messagesResponse.data.data,
        });

        setStatus("success");
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error(error);
          setStatus("error");
        }
      }
    };

    loadDashboard();

    return () => controller.abort();
  }, []);

  const stats = [
    {
      label: "Projeler",
      value: dashboard.projects,
      icon: FolderKanban,
    },
    {
      label: "Hizmetler",
      value: dashboard.services,
      icon: BriefcaseBusiness,
    },
    {
      label: "Mesajlar",
      value: dashboard.messages,
      icon: MessageSquare,
    },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-page-header">
        <div>
          <span>Dashboard / Overview</span>
          <h1>Merhaba, {user?.name}</h1>
          <p>
            Sitenizin içerik ve iletişim özetini buradan takip
            edebilirsiniz.
          </p>
        </div>

        <a href="/" target="_blank" rel="noreferrer">
          Siteyi görüntüle
        </a>
      </header>

      {status === "error" && (
        <div className="admin-alert">
          Dashboard verileri yüklenemedi.
        </div>
      )}

      <section className="admin-stat-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article key={stat.label}>
              <div>
                <span>{stat.label}</span>
                <Icon size={18} />
              </div>

              <strong>
                {status === "loading"
                  ? "—"
                  : String(stat.value).padStart(2, "0")}
              </strong>
            </article>
          );
        })}
      </section>

      <section className="admin-panel">
        <header>
          <div>
            <span>Inbox</span>
            <h2>Son mesajlar</h2>
          </div>
        </header>

        {status === "success" &&
        dashboard.recentMessages.length > 0 ? (
          <div className="admin-message-list">
            {dashboard.recentMessages.map((message) => (
              <article key={message._id}>
                <div>
                  <strong>{message.name}</strong>
                  <span>{message.email}</span>
                </div>

                <p>{message.message}</p>

                <span>{message.status}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">
            <MessageSquare size={24} />
            <p>Henüz iletişim mesajı bulunmuyor.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;