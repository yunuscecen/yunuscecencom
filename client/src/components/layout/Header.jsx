import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { useSiteSettings } from "../../context/SiteContext";

const Header = () => {
  const { settings } = useSiteSettings();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [...(settings.navigation || [])]
    .filter((item) => item.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          className="brand"
          to="/"
          aria-label={`${settings.brand?.name || "Yunus Çeçen"} ana sayfa`}
        >
          <span className="brand__mark">
            {settings.brand?.shortName || "YÇ"}
          </span>

          <span className="brand__text">
            <strong>{settings.brand?.name}</strong>
            <small>{settings.brand?.profession}</small>
          </span>
        </Link>

        <nav className="desktop-navigation" aria-label="Ana navigasyon">
          {navigation.map((item) =>
            item.isExternal ? (
              <a
                key={item._id || item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item._id || item.href}
                to={item.href}
                className={({ isActive }) =>
                  isActive ? "is-active" : undefined
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <Link className="header-contact" to="/iletisim">
          Proje konuşalım
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`mobile-navigation ${
          menuOpen ? "is-open" : ""
        }`}
      >
        <nav aria-label="Mobil navigasyon">
          {navigation.map((item, index) => (
            <NavLink
              key={item._id || item.href}
              to={item.href}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <p>{settings.contact?.availabilityText}</p>
      </div>
    </header>
  );
};

export default Header;