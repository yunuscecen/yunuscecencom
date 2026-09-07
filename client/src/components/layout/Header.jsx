import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import BrandName from "../ui/BrandName";
import { useSiteSettings } from "../../context/SiteContext";

const Header = () => {
  const { settings } = useSiteSettings();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
const [scrolled, setScrolled] = useState(false);
  const navigation = [...(settings.navigation || [])]
    .filter((item) => item.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  const contactLabel =
    settings.header?.contactLabel?.trim() ||
    "Projenizi Konuşalım";

  const contactHref =
    settings.header?.contactHref?.trim() ||
    "/iletisim";

  const showContactButton =
    settings.header?.showContactButton !== false;

  const contactIsExternal =
    /^https?:\/\//i.test(contactHref);

  const desktopNavigation = showContactButton
    ? navigation.filter(
        (item) => item.href !== contactHref
      )
    : navigation;
useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 24);
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const renderNavigationItem = (item, mobile = false) => {
    const content = (
      <>
        {mobile && (
          <span>
            {String(
              navigation.findIndex(
                (navigationItem) =>
                  navigationItem._id === item._id ||
                  navigationItem.href === item.href
              ) + 1
            ).padStart(2, "0")}
          </span>
        )}

        {item.label}
      </>
    );

    if (item.isExternal) {
      return (
        <a
          key={item._id || item.href}
          href={item.href}
          target="_blank"
          rel="noreferrer"
        >
          {content}
        </a>
      );
    }

    return (
      <NavLink
        key={item._id || item.href}
        to={item.href}
        className={({ isActive }) =>
          isActive ? "is-active" : undefined
        }
      >
        {content}
      </NavLink>
    );
  };

  return (
  <header
  className={[
    "site-header",
    location.pathname === "/" ? "is-home" : "",
    scrolled ? "is-scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ")}
>
      <div className="site-header__inner">
        <Link
          className="brand"
          to="/"
          aria-label={`${
            settings.brand?.name || "Yunus Çeçen"
          } ana sayfa`}
        >
          <span className="brand__mark">
            {settings.brand?.logoUrl ? (
              <img
                src={settings.brand.logoUrl}
                alt={settings.brand.logoAlt || ""}
              />
            ) : (
              settings.brand?.shortName || "YÇ"
            )}
          </span>

          <span className="brand__text">
            <BrandName
  as="strong"
  name={settings.brand?.name}
/>
            <small>{settings.brand?.profession}</small>
          </span>
        </Link>

        <nav
          className="desktop-navigation"
          aria-label="Ana navigasyon"
        >
          {desktopNavigation.map((item) =>
            renderNavigationItem(item)
          )}
        </nav>

     <div className="header-actions">
  {showContactButton &&
    (contactIsExternal ? (
      <a
        className="header-contact"
        href={contactHref}
        target="_blank"
        rel="noreferrer"
      >
        {contactLabel}
        <ArrowUpRight size={17} aria-hidden="true" />
      </a>
    ) : (
      <Link
        className="header-contact"
        to={contactHref}
      >
        {contactLabel}
        <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
    ))}

  <button
    className="header-client-panel"
    type="button"
    aria-disabled="true"
    aria-describedby="client-panel-tooltip"
  >
    <span
      className="header-client-panel__dot"
      aria-hidden="true"
    />

    <span>Müşteri Paneli</span>

    <span
      className="header-client-panel__tooltip"
      id="client-panel-tooltip"
      role="tooltip"
    >
      Yapım aşamasında
    </span>
  </button>
</div>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
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
          {navigation.map((item) =>
            renderNavigationItem(item, true)
          )}
        </nav>

        <p>{settings.contact?.availabilityText}</p>
      </div>
    </header>
  );
};

export default Header;