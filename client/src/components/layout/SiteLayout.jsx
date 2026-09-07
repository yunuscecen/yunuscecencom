import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Header from "./Header";
import ScrollProgressButton from "./ScrollProgressButton";
const SiteLayout = () => {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main-content">
        İçeriğe geç
      </a>

      <Header />

      <main id="main-content">
        <Outlet />
      </main>

      <Footer />
      <ScrollProgressButton />
    </div>
  );
};

export default SiteLayout;