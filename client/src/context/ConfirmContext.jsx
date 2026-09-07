import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import ConfirmDialog from "../components/admin/ConfirmDialog";

const ConfirmContext = createContext(null);

const initialDialog = {
  open: false,
  title: "",
  description: "",
  confirmLabel: "Onayla",
  cancelLabel: "Vazgeç",
  tone: "danger",
};

export const ConfirmProvider = ({ children }) => {
  const [dialog, setDialog] = useState(initialDialog);
  const resolverRef = useRef(null);

  const closeDialog = useCallback((result) => {
    const resolver = resolverRef.current;

    resolverRef.current = null;
    setDialog(initialDialog);

    if (resolver) {
      resolver(result);
    }
  }, []);

  const requestConfirmation = useCallback(
    (options = {}) =>
      new Promise((resolve) => {
        if (resolverRef.current) {
          resolverRef.current(false);
        }

        resolverRef.current = resolve;

        setDialog({
          ...initialDialog,
          ...options,
          open: true,
        });
      }),
    []
  );

  useEffect(() => {
    return () => {
      if (resolverRef.current) {
        resolverRef.current(false);
      }
    };
  }, []);

  return (
    <ConfirmContext.Provider
      value={requestConfirmation}
    >
      {children}

      <ConfirmDialog
        {...dialog}
        onConfirm={() => closeDialog(true)}
        onCancel={() => closeDialog(false)}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error(
      "useConfirm, ConfirmProvider içerisinde kullanılmalıdır."
    );
  }

  return context;
};