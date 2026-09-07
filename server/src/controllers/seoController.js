import Project from "../models/Project.js";
import asyncHandler from "../utils/asyncHandler.js";

const removeTrailingSlash = (value = "") =>
  value.replace(/\/+$/, "");

const getSiteUrl = () => {
  const configuredUrl =
    process.env.SITE_URL ||
    process.env.CLIENT_URL?.split(",")[0] ||
    "http://localhost:5173";

  return removeTrailingSlash(configuredUrl.trim());
};

const escapeXml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const createUrlEntry = ({
  url,
  lastModified,
  changeFrequency,
  priority,
}) => {
  return [
    "  <url>",
    `    <loc>${escapeXml(url)}</loc>`,
    lastModified
      ? `    <lastmod>${new Date(lastModified).toISOString()}</lastmod>`
      : "",
    changeFrequency
      ? `    <changefreq>${changeFrequency}</changefreq>`
      : "",
    priority
      ? `    <priority>${priority}</priority>`
      : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
};

export const getSitemap = asyncHandler(async (req, res) => {
  const siteUrl = getSiteUrl();

  const projects = await Project.find({
    published: true,
  })
    .select("slug updatedAt")
    .sort({
      updatedAt: -1,
    })
    .lean();

  const staticPages = [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: "1.0",
    },
    {
      url: `${siteUrl}/projeler`,
      changeFrequency: "weekly",
      priority: "0.9",
    },
    {
      url: `${siteUrl}/hakkimda`,
      changeFrequency: "monthly",
      priority: "0.8",
    },
    {
      url: `${siteUrl}/hizmetler`,
      changeFrequency: "monthly",
      priority: "0.8",
    },
    {
      url: `${siteUrl}/iletisim`,
      changeFrequency: "monthly",
      priority: "0.7",
    },
  ];

  const projectPages = projects.map((project) => ({
    url: `${siteUrl}/projeler/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly",
    priority: "0.8",
  }));

  const entries = [...staticPages, ...projectPages]
    .map(createUrlEntry)
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    "</urlset>",
  ].join("\n");

  res
    .status(200)
    .type("application/xml")
    .send(xml);
});

export const getRobots = asyncHandler(async (req, res) => {
  const siteUrl = getSiteUrl();

  const currentServerUrl =
    process.env.SERVER_URL ||
    `${req.protocol}://${req.get("host")}`;

  const sitemapUrl =
    process.env.SITEMAP_URL ||
    `${removeTrailingSlash(currentServerUrl)}/sitemap.xml`;

  const robots = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    `Sitemap: ${sitemapUrl}`,
    `Host: ${siteUrl}`,
  ].join("\n");

  res
    .status(200)
    .type("text/plain")
    .send(robots);
});