import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useSiteSettings } from "../../context/SiteContext";

const Footer = () => {
  const { settings } = useSiteSettings();

  const socials = [...(settings.socials || [])]
    .filter((item) => item.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__headline">
        <p className="eyebrow">{settings.footer?.eyebrow}</p>
        <h2>{settings.footer?.title}</h2>

        <Link className="text-link" to="/iletisim">
          İletişime geç
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>

      <div className="site-footer__bottom">
        <div>
          <strong>{settings.brand?.name}</strong>
          <p>{settings.brand?.profession}</p>
        </div>

        {socials.length > 0 && (
          <nav aria-label="Sosyal medya">
            {socials.map((social) => (
              <a
                key={social._id || social.url}
                href={social.url}
                target="_blank"
                rel="noreferrer"
              >
                {social.platform}
              </a>
            ))}
          </nav>
        )}

        <p>
          © {currentYear} {settings.brand?.name}.{" "}
          {settings.footer?.copyrightText}
        </p>
      </div>
    </footer>
  );
};

export default Footer;