import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { LangProvider } from "./i18n";
import { SiteProvider } from "./site";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SiteProvider>
      <LangProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LangProvider>
    </SiteProvider>
  </StrictMode>,
);
