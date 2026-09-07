export const advertisingPortfolioFallback = {
  isVisible: true,
  eyebrow: "AdFolio / Advertising archive",
  title:
    "Markaların yalnızca görülmesini değil, hatırlanmasını tasarlıyorum.",
  description:
    "Sosyal medya, kampanya ve dijital reklam çalışmalarımdan oluşan seçili bir görsel arşiv.",
  buttonLabel: "Reklam tasarımlarını incele",
  pageKicker: "Selected advertising work / Behance",
  pageTitle: "Reklam Tasarımları",
  pageDescription:
    "Farklı markalar, kampanyalar ve dijital platformlar için hazırladığım reklam ve sosyal medya tasarımları.",
  projects: [
    {
      projectId: "211707071",
      title: "Reklam Tasarımları #1",
      projectUrl:
        "https://www.behance.net/gallery/211707071/AdFolio-Advertising-Social-Media-Design",
      embedUrl:
        "https://www.behance.net/embed/project/211707071?ilo0=1",
      coverUrl:
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/96fadd211707071.Y3JvcCw4MDgsNjMyLDAsMA.png",
      order: 1,
      isVisible: true,
    },
    {
      projectId: "211707899",
      title: "Reklam Tasarımları #2",
      projectUrl:
        "https://www.behance.net/gallery/211707899/AdFolio-Advertising-Social-Media-Design",
      embedUrl:
        "https://www.behance.net/embed/project/211707899?ilo0=1",
      coverUrl:
        "https://mir-s3-cdn-cf.behance.net/projects/max_808/472eb1211707899.Y3JvcCw4MDgsNjMyLDAsMA.png",
      order: 2,
      isVisible: true,
    },
  ],
  seo: {
    title: "Reklam Tasarımları",
    description:
      "Yunus Çeçen tarafından hazırlanan reklam ve sosyal medya tasarımı çalışmaları.",
  },
};

export const mergeAdvertisingPortfolio = (data = {}) => {
  const sourceProjects =
    Array.isArray(data.projects) && data.projects.length > 0
      ? data.projects
      : advertisingPortfolioFallback.projects;

  return {
    ...advertisingPortfolioFallback,
    ...data,
    projects: sourceProjects.map((project, index) => ({
      ...(advertisingPortfolioFallback.projects[index] || {}),
      ...project,
    })),
    seo: {
      ...advertisingPortfolioFallback.seo,
      ...data.seo,
    },
  };
};