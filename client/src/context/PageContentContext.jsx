import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import http from "../api/http";

const PageContentContext = createContext(null);

const initialContent = {
  home: {},
  projects: {},
  services: {},
  about: {},
  projectDetail: {},
  contact: {},
};

export const PageContentProvider = ({ children }) => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadContent = useCallback(async (signal) => {
    setLoading(true);
    setError(false);

    try {
      const response = await http.get("/page-content", {
        signal,
      });

      setContent({
        ...initialContent,
        ...response.data.data,
      });
    } catch (requestError) {
      if (requestError.code !== "ERR_CANCELED") {
        console.error("Sayfa metinleri alınamadı.", requestError);
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadContent(controller.signal);

    return () => controller.abort();
  }, [loadContent]);

  const replaceContent = (nextContent) => {
    setContent({
      ...initialContent,
      ...nextContent,
    });
  };

  return (
    <PageContentContext.Provider
      value={{
        content,
        loading,
        error,
        reloadContent: loadContent,
        replaceContent,
      }}
    >
      {children}
    </PageContentContext.Provider>
  );
};

export const usePageContent = () => {
  const context = useContext(PageContentContext);

  if (!context) {
    throw new Error(
      "usePageContent, PageContentProvider içerisinde kullanılmalıdır."
    );
  }

  return context;
};