import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import http from "../api/http";

const SiteContext = createContext(null);

const fallbackSettings = {
  brand: {
    name: "Yunus Çeçen",
    shortName: "YÇ",
    profession: "Software Developer & Designer",
    logoUrl: "",
    logoPublicId: "",
    logoAlt: "",
  },

  header: {
    contactLabel: "Proje konuşalım",
    contactHref: "/iletisim",
    showContactButton: true,
  },

  navigation: [
    {
      label: "Ana Sayfa",
      href: "/",
      isExternal: false,
      isVisible: true,
      order: 0,
    },
    {
      label: "Projeler",
      href: "/projeler",
      isExternal: false,
      isVisible: true,
      order: 1,
    },
    {
      label: "Hakkımda",
      href: "/hakkimda",
      isExternal: false,
      isVisible: true,
      order: 2,
    },
    {
      label: "Hizmetler",
      href: "/hizmetler",
      isExternal: false,
      isVisible: true,
      order: 3,
    },
    {
      label: "İletişim",
      href: "/iletisim",
      isExternal: false,
      isVisible: true,
      order: 4,
    },
  ],

  contact: {
    email: "",
    phone: "",
    location: "Türkiye",
    availabilityText: "Yeni freelance projeler için müsaitim.",
  },

  socials: [],

  footer: {
    eyebrow: "Birlikte çalışalım",
    title: "Aklındaki projeyi birlikte hayata geçirelim.",
    description: "",
    buttonLabel: "İletişime geç",
    buttonHref: "/iletisim",
    copyrightText: "Tüm hakları saklıdır.",
  },

  seo: {
    defaultTitle: "Yunus Çeçen — Yazılım Geliştirici & Tasarımcı",
    titleTemplate: "%s | Yunus Çeçen",
    description: "",
    keywords: [],
  },
};

const mergeSettings = (data = {}) => ({
  ...fallbackSettings,
  ...data,

  brand: {
    ...fallbackSettings.brand,
    ...data.brand,
  },

  header: {
    ...fallbackSettings.header,
    ...data.header,
  },

  navigation: Array.isArray(data.navigation)
    ? data.navigation
    : fallbackSettings.navigation,

  contact: {
    ...fallbackSettings.contact,
    ...data.contact,
  },

  socials: Array.isArray(data.socials)
    ? data.socials
    : fallbackSettings.socials,

  footer: {
    ...fallbackSettings.footer,
    ...data.footer,
  },

  seo: {
    ...fallbackSettings.seo,
    ...data.seo,
  },
});

const extractData = (response) =>
  response.data?.data ||
  response.data?.content ||
  response.data;

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(fallbackSettings);
  const [loading, setLoading] = useState(true);

  const replaceSettings = useCallback((nextSettings) => {
    setSettings(mergeSettings(nextSettings));
  }, []);

  const refreshSettings = useCallback(async () => {
    const response = await http.get("/content/settings");
    const nextSettings = mergeSettings(extractData(response));

    setSettings(nextSettings);

    return nextSettings;
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadSettings = async () => {
      try {
        const response = await http.get("/content/settings", {
          signal: controller.signal,
        });

        setSettings(mergeSettings(extractData(response)));
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error("Site ayarları alınamadı.", error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSettings();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (settings.seo?.defaultTitle) {
      document.title = settings.seo.defaultTitle;
    }

    let descriptionElement = document.querySelector(
      'meta[name="description"]'
    );

    if (!descriptionElement) {
      descriptionElement = document.createElement("meta");
      descriptionElement.setAttribute("name", "description");
      document.head.appendChild(descriptionElement);
    }

    descriptionElement.setAttribute(
      "content",
      settings.seo?.description || ""
    );

    let keywordsElement = document.querySelector(
      'meta[name="keywords"]'
    );

    if (!keywordsElement) {
      keywordsElement = document.createElement("meta");
      keywordsElement.setAttribute("name", "keywords");
      document.head.appendChild(keywordsElement);
    }

    keywordsElement.setAttribute(
      "content",
      (settings.seo?.keywords || []).join(", ")
    );
  }, [settings.seo]);

  const contextValue = useMemo(
    () => ({
      settings,
      loading,
      replaceSettings,
      refreshSettings,
    }),
    [settings, loading, replaceSettings, refreshSettings]
  );

  return (
    <SiteContext.Provider value={contextValue}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteContext);

  if (!context) {
    throw new Error(
      "useSiteSettings, SiteProvider içerisinde kullanılmalıdır."
    );
  }

  return context;
};