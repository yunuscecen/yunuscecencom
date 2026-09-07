import { useEffect } from "react";

const defaultMessage =
  "Kaydedilmemiş değişikliklerin var. Sayfadan ayrılmak istediğine emin misin?";

const useUnsavedChanges = (
  enabled,
  message = defaultMessage
) => {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = true;
    };

    const handleLinkClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = event.target.closest("a[href]");

      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const destination = anchor.href;
      const currentLocation = window.location.href;

      if (!destination || destination === currentLocation) {
        return;
      }

      const shouldLeave = window.confirm(message);

      if (!shouldLeave) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    document.addEventListener(
      "click",
      handleLinkClick,
      true
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );

      document.removeEventListener(
        "click",
        handleLinkClick,
        true
      );
    };
  }, [enabled, message]);
};

export default useUnsavedChanges;