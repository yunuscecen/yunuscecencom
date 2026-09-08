import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronUp,
  Languages,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const GOOGLE_SCRIPT_ID = "google-translate-script";
const LANGUAGE_STORAGE_KEY = "site-language";

const languages = [
  {
    code: "en",
    shortLabel: "EN",
    label: "English",
  },
  {
    code: "tr",
    shortLabel: "TR",
    label: "Türkçe",
  },
  {
    code: "de",
    shortLabel: "DE",
    label: "Deutsch",
  },
  {
    code: "fr",
    shortLabel: "FR",
    label: "Français",
  }
];

const getInitialLanguage = () => {
  const storedLanguage = window.localStorage.getItem(
    LANGUAGE_STORAGE_KEY
  );

  const isSupported = languages.some(
    (language) => language.code === storedLanguage
  );

  return isSupported ? storedLanguage : "en";
};

const setGoogleTranslationCookie = (languageCode) => {
  const expires = new Date();

  expires.setFullYear(expires.getFullYear() + 1);

  document.cookie = [
    `googtrans=/tr/${languageCode}`,
    "path=/",
    `expires=${expires.toUTCString()}`,
    "SameSite=Lax",
  ].join("; ");
};

const clearGoogleTranslationCookie = () => {
  document.cookie = [
    "googtrans=",
    "path=/",
    "expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "SameSite=Lax",
  ].join("; ");
};

const GoogleTranslateSwitcher = () => {
  const { pathname } = useLocation();

  const switcherRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeLanguage] = useState(getInitialLanguage);

  /*
   * Google Translate scriptini yalnızca public
   * sayfalarda ve yalnızca bir kez yükler.
   */
  useEffect(() => {
    document.documentElement.lang = activeLanguage;

    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      activeLanguage
    );

    if (activeLanguage === "tr") {
      clearGoogleTranslationCookie();
    } else {
      setGoogleTranslationCookie(activeLanguage);
    }

    const initializeGoogleTranslate = () => {
      const container = document.getElementById(
        "google_translate_element"
      );

      if (
        !container ||
        container.childElementCount > 0 ||
        !window.google?.translate?.TranslateElement
      ) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "tr",
          includedLanguages: "en,tr,de,fr",
          autoDisplay: false,
          multilanguagePage: true,
          layout:
            window.google.translate.TranslateElement
              .InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    window.googleTranslateElementInit =
      initializeGoogleTranslate;

    if (window.google?.translate?.TranslateElement) {
      initializeGoogleTranslate();
      return;
    }

    if (!document.getElementById(GOOGLE_SCRIPT_ID)) {
      const script = document.createElement("script");

      script.id = GOOGLE_SCRIPT_ID;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;

      document.body.appendChild(script);
    }
  }, [activeLanguage]);

  /*
   * React Router ile sayfa değiştirildiğinde yeni gelen
   * metinlerin de seçili dile çevrilmesini tekrar tetikler.
   */
  useEffect(() => {
    if (activeLanguage === "tr") {
      return undefined;
    }

    let attempt = 0;
    let timeoutId;

    const applyLanguage = () => {
      const googleSelect = document.querySelector(
        ".goog-te-combo"
      );

      if (googleSelect) {
        googleSelect.value = activeLanguage;

        googleSelect.dispatchEvent(
          new Event("change", {
            bubbles: true,
          })
        );

        return;
      }

      attempt += 1;

      if (attempt < 20) {
        timeoutId = window.setTimeout(
          applyLanguage,
          250
        );
      }
    };

    timeoutId = window.setTimeout(applyLanguage, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pathname, activeLanguage]);

  /*
   * Dil menüsünün dışına basıldığında kapatır.
   */
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  const changeLanguage = (languageCode) => {
    setIsOpen(false);

    if (languageCode === activeLanguage) {
      return;
    }

    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      languageCode
    );

    if (languageCode === "tr") {
      clearGoogleTranslationCookie();
    } else {
      setGoogleTranslationCookie(languageCode);
    }

    /*
     * Google'ın sayfadaki bütün metinleri yeniden ve
     * eksiksiz çevirebilmesi için sayfayı yeniler.
     */
    window.location.reload();
  };

  const selectedLanguage =
    languages.find(
      (language) => language.code === activeLanguage
    ) || languages[0];

  return (
    <div
      className="google-language-switcher notranslate"
      ref={switcherRef}
      translate="no"
    >
      <div
        className="google-translate-engine"
        id="google_translate_element"
        aria-hidden="true"
      />

      {isOpen && (
        <div
          className="language-menu"
          role="menu"
          aria-label="Site dili"
        >
          <div className="language-menu__heading">
            <span>Language</span>
            <small>Site dilini seçin</small>
          </div>

          <div className="language-menu__options">
            {languages.map((language) => {
              const isActive =
                language.code === activeLanguage;

              return (
                <button
                  className={
                    isActive ? "is-active" : ""
                  }
                  type="button"
                  role="menuitem"
                  key={language.code}
                  onClick={() =>
                    changeLanguage(language.code)
                  }
                >
                  <span>{language.shortLabel}</span>
                  <strong>{language.label}</strong>

                  {isActive && (
                    <Check
                      size={15}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <p className="language-menu__credit">
            Powered by Google Translate 
          </p>
        </div>
      )}

      <button
        className="language-switcher-trigger"
        type="button"
        aria-label="Site dilini değiştir"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <Languages size={16} aria-hidden="true" />

        <span>{selectedLanguage.shortLabel}</span>

        <ChevronUp
          className={isOpen ? "is-open" : ""}
          size={14}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default GoogleTranslateSwitcher;