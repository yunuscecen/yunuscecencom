import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { SiteProvider } from "./context/SiteContext";
import { AuthProvider } from "./context/AuthContext";
import { PageContentProvider } from "./context/PageContentContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import "./index.css";
import "./styles/admin.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
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
  </StrictMode>
);