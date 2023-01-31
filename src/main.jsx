import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./main.css";
import ContextProvider from "./context/Context";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import login_es from "./translations/es/login.json";
import login_en from "./translations/en/login.json";
import topbarLandingPage_es from "./translations/es/topbarLandingPage.json";
import topbarLandingPage_en from "./translations/en/topbarLandingPage.json";
import registration_es from "./translations/es/registration.json";
import registration_en from "./translations/en/registration.json";

i18next.init({
  interpolation: { escapeValue: false },
  lng: "es",
  resources: {
    es: {
      login: login_es,
      topbarLandingPage: topbarLandingPage_es,
      registration: registration_es,
    },
    en: {
      login: login_en,
      topbarLandingPage: topbarLandingPage_en,
      registration: registration_en,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContextProvider>
        <I18nextProvider i18n={i18next}>
          <App />
        </I18nextProvider>
      </ContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
