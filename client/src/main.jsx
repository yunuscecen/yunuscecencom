import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import { PageContentProvider } from "./context/PageContentContext";
import { SiteProvider } from "./context/SiteContext";

import "./index.css";
import "./styles/admin.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <SiteProvider>
            <PageContentProvider>
              <ConfirmProvider>
                <App />
              </ConfirmProvider>
            </PageContentProvider>
          </SiteProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);