import { Route, Routes } from "react-router-dom";

import SiteLayout from "./components/layout/SiteLayout";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

const NotFoundPage = () => (
  <section className="page-state">
    <span>404</span>
    <h1>Bu sayfayı henüz bulamıyoruz.</h1>
    <a href="/">Ana sayfaya dön</a>
  </section>
);

const App = () => {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/projeler" element={<ProjectsPage />} />
<Route
  path="/projeler/:slug"
  element={<ProjectDetailPage />}
/>
      </Route>
    </Routes>
  );
};

export default App;