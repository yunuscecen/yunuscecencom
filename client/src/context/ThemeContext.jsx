import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

const storageKey = "yunuscecen-theme";

const getInitialTheme = () => {
  try {
    const storedTheme =
      window.localStorage.getItem(storageKey);

    return storedTheme === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const themeColor = document.querySelector(
      'meta[name="theme-color"]'
    );

    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // Tarayıcı depolamayı engelliyorsa tema yine çalışır.
    }

    if (themeColor) {
      themeColor.setAttribute(
        "content",
        theme === "dark" ? "#090a0d" : "#f3f2ee"
      );
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme, ThemeProvider içerisinde kullanılmalıdır."
    );
  }

  return context;
};