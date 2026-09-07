import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation } from "react-router-dom";

const ScrollProgressButton = () => {
  const { pathname } = useLocation();

  const animationFrameRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  /*
   * Public sayfa değiştiğinde önceki sayfanın
   * kaydırma konumunu taşımadan en üste çıkar.
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    setProgress(0);
    setVisible(false);
  }, [pathname]);

  useEffect(() => {
    const calculateProgress = () => {
      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const scrollPosition =
        window.scrollY ||
        document.documentElement.scrollTop;

      const nextProgress =
        documentHeight > 0
          ? Math.min(
              Math.max(
                (scrollPosition / documentHeight) * 100,
                0
              ),
              100
            )
          : 0;

      setProgress(nextProgress);
      setVisible(scrollPosition > 320);
    };

    const handleViewportChange = () => {
      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current =
        window.requestAnimationFrame(() => {
          calculateProgress();
          animationFrameRef.current = null;
        });
    };

    calculateProgress();

    window.addEventListener("scroll", handleViewportChange, {
      passive: true,
    });

    window.addEventListener("resize", handleViewportChange);

    /*
     * API'den içerik veya görseller sonradan geldiğinde
     * sayfa yüksekliğini yeniden hesaplar.
     */
    const resizeObserver = new ResizeObserver(
      handleViewportChange
    );

    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener(
        "scroll",
        handleViewportChange
      );

      window.removeEventListener(
        "resize",
        handleViewportChange
      );

      resizeObserver.disconnect();

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      className={`scroll-progress-button ${
        visible ? "is-visible" : ""
      }`}
      type="button"
      style={{
        "--scroll-progress": `${progress}%`,
      }}
      aria-label={`Sayfanın başına dön. Sayfa ilerlemesi yüzde ${Math.round(
        progress
      )}`}
      onClick={scrollToTop}
    >
      <ArrowUp aria-hidden="true" />
    </button>
  );
};

export default ScrollProgressButton;