import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import http from "../api/http";

const SiteContext = createContext(null);

const fallbackSettings = {
  brand: {
    name: "Yunus Çeçen",
    shortName: "YÇ",
    profession: "Software Developer & Designer",
  },
  navigation: [
    { label: "Ana Sayfa", href: "/", order: 1 },
    { label: "Projeler", href: "/projeler", order: 2 },
    { label: "Hakkımda", href: "/hakkimda", order: 3 },
    { label: "Hizmetler", href: "/hizmetler", order: 4 },
    { label: "İletişim", href: "/iletisim", order: 5 },
  ],
  contact: {
    email: "",
    location: "Türkiye",
    availabilityText: "Yeni freelance projeler için müsaitim.",
  },
  socials: [],
  footer: {
    eyebrow: "Birlikte çalışalım",
    title: "Aklındaki projeyi birlikte hayata geçirelim.",
    description: "",
    copyrightText: "Tüm hakları saklıdır.",
  },
};

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(fallbackSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadSettings = async () => {
      try {
        const response = await http.get("/content/settings", {
          signal: controller.signal,
        });

        setSettings(response.data.data);
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

  return (
    <SiteContext.Provider value={{ settings, loading }}>
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