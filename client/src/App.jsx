import { Route, Routes } from "react-router-dom";

import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import SiteLayout from "./components/layout/SiteLayout";

import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ServicesPage from "./pages/ServicesPage";
import AdminMediaPage from "./pages/admin/AdminMediaPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminPlaceholderPage from "./pages/admin/AdminPlaceholderPage";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminHomePage from "./pages/admin/AdminHomePage";
const NotFoundPage = () => (
  <section className="page-state">
    <span>404</span>
    <h1>Bu sayfa bulunamadı.</h1>

    <a className="light-button" href="/">
      Ana sayfaya dön
    </a>
  </section>
);

const App = () => {
  return (
    <Routes>
      {/* Ziyaretçi sayfaları */}
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />

        <Route
          path="projeler"
          element={<ProjectsPage />}
        />

        <Route
          path="projeler/:slug"
          element={<ProjectDetailPage />}
        />

        <Route
          path="hakkimda"
          element={<AboutPage />}
        />

        <Route
          path="hizmetler"
          element={<ServicesPage />}
        />

        <Route
          path="iletisim"
          element={<ContactPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Route>

      {/* Admin giriş sayfası */}
      <Route
        path="/admin/login"
        element={<AdminLoginPage />}
      />

      {/* Giriş gerektiren admin sayfaları */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route
            index
            element={<DashboardPage />}
          />

         <Route path="home" element={<AdminHomePage />} />

          <Route
            path="about"
            element={
              <AdminPlaceholderPage
                eyebrow="Content / About"
                title="Hakkımda"
                description="Profil, yetenekler ve deneyim içeriğini yönetin."
              />
            }
          />

          <Route
            path="projects"
            element={
              <AdminPlaceholderPage
                eyebrow="Content / Projects"
                title="Projeler"
                description="Proje arşivini ve galeri görsellerini yönetin."
              />
            }
          />

          <Route
            path="services"
            element={
              <AdminPlaceholderPage
                eyebrow="Content / Services"
                title="Hizmetler"
                description="Hizmet içeriklerini ve görsellerini yönetin."
              />
            }
          />

          <Route
            path="messages"
            element={
              <AdminPlaceholderPage
                eyebrow="Inbox / Messages"
                title="Mesajlar"
                description="İletişim formundan gelen talepleri yönetin."
              />
            }
          />

          <Route
  path="media"
  element={<AdminMediaPage />}
/>

          <Route
            path="settings"
            element={
              <AdminPlaceholderPage
                eyebrow="System / Settings"
                title="Site Ayarları"
                description="Header, footer ve iletişim bilgilerini yönetin."
              />
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;