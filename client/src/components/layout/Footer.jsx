import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useSiteSettings } from "../../context/SiteContext";

const Footer = () => {
  const { settings } = useSiteSettings();

  const socials = [...(settings.socials || [])]
    .filter((item) => item.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  const currentYear = new Date().getFullYear();
  const buttonHref =
    settings.footer?.buttonHref || "/iletisim";

  const buttonIsExternal = /^https?:\/\//i.test(buttonHref);

  const buttonContent = (
    <>
      {settings.footer?.buttonLabel || "İletişime geç"}
      <ArrowUpRight aria-hidden="true" />
    </>
  );

  return (
    <footer className="site-footer">
      <div className="site-footer__headline">
        <p className="eyebrow">
          {settings.footer?.eyebrow}
        </p>

        <h2>{settings.footer?.title}</h2>

        {settings.footer?.description && (
          <p className="site-footer__description">
            {settings.footer.description}
          </p>
        )}

        {buttonIsExternal ? (
          <a
            className="text-link"
            href={buttonHref}
            target="_blank"
            rel="noreferrer"
          >
            {buttonContent}
          </a>
        ) : (
          <Link className="text-link" to={buttonHref}>
            {buttonContent}
          </Link>
        )}
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
                title={social.username || social.platform}
              >
                <span>{social.platform}</span>

                {social.username && (
                  <small>{social.username}</small>
                )}
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