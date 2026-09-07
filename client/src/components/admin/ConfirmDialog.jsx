import {
  useEffect,
  useId,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  tone = "danger",
  onConfirm,
  onCancel,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="confirm-dialog"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <section
        className={`confirm-dialog__panel confirm-dialog__panel--${tone}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button
          className="confirm-dialog__close"
          type="button"
          aria-label="Pencereyi kapat"
          onClick={onCancel}
        >
          <X size={18} />
        </button>

        <div className="confirm-dialog__icon">
          <AlertTriangle size={22} />
        </div>

        <div className="confirm-dialog__content">
          <p>İşlemi onayla</p>
          <h2 id={titleId}>{title}</h2>
          <span id={descriptionId}>
            {description}
          </span>
        </div>

        <div className="confirm-dialog__actions">
          <button
            className="confirm-dialog__button confirm-dialog__button--cancel"
            type="button"
            onClick={onCancel}
            ref={cancelButtonRef}
          >
            {cancelLabel}
          </button>

          <button
            className={`confirm-dialog__button confirm-dialog__button--${tone}`}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
};

export default ConfirmDialog;