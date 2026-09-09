import {
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import SiteLayout from "./components/layout/SiteLayout";
import Seo from "./components/Seo";

import AboutPage from "./pages/AboutPage";
import AdvertisingDesignsPage from "./pages/AdvertisingDesignsPage";
import ContactPage from "./pages/ContactPage";
import CvPage from "./pages/CvPage";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ServicesPage from "./pages/ServicesPage";

import AdminAboutPage from "./pages/admin/AdminAboutPage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminMediaPage from "./pages/admin/AdminMediaPage";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage";
import AdminPageContentPage from "./pages/admin/AdminPageContentPage";
import AdminProjectsPage from "./pages/admin/AdminProjectsPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import DashboardPage from "./pages/admin/DashboardPage";

const NotFoundPage = () => (
  <>
    <Seo
      title="Sayfa bulunamadı"
      description="Aradığınız sayfa bulunamadı."
      noIndex
    />

    <section className="page-state">
      <span>404</span>
      <h1>Bu sayfa bulunamadı.</h1>

      <Link className="light-button" to="/">
        Ana sayfaya dön
      </Link>
    </section>
  </>
);

const App = () => {
  return (
    <Routes>
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
  path="reklam-tasarimlari"
  element={<AdvertisingDesignsPage />}
/>
<Route
  path="cv"
  element={<CvPage />}
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

      <Route
        path="/admin/login"
        element={<AdminLoginPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route
            index
            element={<DashboardPage />}
          />

          <Route
            path="sayfa-metinleri"
            element={<AdminPageContentPage />}
          />

          <Route
            path="home"
            element={<AdminHomePage />}
          />

          <Route
            path="about"
            element={<AdminAboutPage />}
          />

          <Route
            path="projects"
            element={<AdminProjectsPage />}
          />

          <Route
            path="services"
            element={<AdminServicesPage />}
          />

          <Route
            path="messages"
            element={<AdminMessagesPage />}
          />

          <Route
            path="media"
            element={<AdminMediaPage />}
          />

          <Route
            path="settings"
            element={<AdminSettingsPage />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/admin"
                replace
              />
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;