import { Route, Routes } from "react-router-dom";

import SiteLayout from "./components/layout/SiteLayout";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ServicesPage from "./pages/ServicesPage";

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
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projeler" element={<ProjectsPage />} />
        <Route
          path="projeler/:slug"
          element={<ProjectDetailPage />}
        />
        <Route path="hakkimda" element={<AboutPage />} />
        <Route path="hizmetler" element={<ServicesPage />} />
        <Route path="iletisim" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;