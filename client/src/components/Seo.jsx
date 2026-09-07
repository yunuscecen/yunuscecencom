import { useEffect } from "react";

import { useSiteSettings } from "../context/SiteContext";

const setMetaTag = (attribute, key, content) => {
  let element = document.head.querySelector(
    `meta[${attribute}="${key}"]`
  );

  if (!content) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const setCanonicalLink = (url) => {
  let element = document.head.querySelector(
    'link[rel="canonical"]'
  );

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", url);
};

const Seo = ({
  title = "",
  description = "",
  image = "",
  type = "website",
  noIndex = false,
}) => {
  const { settings } = useSiteSettings();

  useEffect(() => {
    const brandName =
      settings.brand?.name || "Yunus Çeçen";

    const defaultTitle =
      settings.seo?.defaultTitle ||
      `${brandName} — Yazılım Geliştirici & Tasarımcı`;

    const titleTemplate =
      settings.seo?.titleTemplate ||
      `%s | ${brandName}`;

    const cleanTitle = title.trim();

    const resolvedTitle = cleanTitle
      ? titleTemplate.includes("%s")
        ? titleTemplate.replace("%s", cleanTitle)
        : `${cleanTitle} | ${brandName}`
      : defaultTitle;

    const resolvedDescription =
      description.trim() ||
      settings.seo?.description ||
      "";

    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;

    const keywords = (settings.seo?.keywords || [])
      .filter(Boolean)
      .join(", ");

    document.title = resolvedTitle;

    setCanonicalLink(canonicalUrl);

    setMetaTag(
      "name",
      "description",
      resolvedDescription
    );

    setMetaTag("name", "keywords", keywords);

    setMetaTag(
      "name",
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large"
    );

    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:locale", "tr_TR");
    setMetaTag("property", "og:site_name", brandName);
    setMetaTag("property", "og:title", resolvedTitle);
    setMetaTag(
      "property",
      "og:description",
      resolvedDescription
    );
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:image", image);

    setMetaTag(
      "name",
      "twitter:card",
      image ? "summary_large_image" : "summary"
    );
    setMetaTag("name", "twitter:title", resolvedTitle);
    setMetaTag(
      "name",
      "twitter:description",
      resolvedDescription
    );
    setMetaTag("name", "twitter:image", image);
  }, [
    title,
    description,
    image,
    type,
    noIndex,
    settings.brand?.name,
    settings.seo?.defaultTitle,
    settings.seo?.titleTemplate,
    settings.seo?.description,
    settings.seo?.keywords,
  ]);

  return null;
};

export default Seo;