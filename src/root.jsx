import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./index.css";
import "./i18n.js";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { useEffect } from "react";
import i18n from "./i18n.js";

function LanguageWatcher() {
  useEffect(() => {
    const updateLang = (lng) => {
      document.documentElement.lang = lng || 'en'
    }
    updateLang(i18n.language)
    i18n.on('languageChanged', updateLang)
    return () => i18n.off('languageChanged', updateLang)
  }, [])
  return null
}

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Ala unites Madagascar’s mining and agricultural sectors to regenerate land, empower communities, and create bankable, sustainable returns." />
        <meta name="theme-color" content="#0B3D2E" />
        <meta name="color-scheme" content="dark light" />
        <link rel="icon" type="image/svg+xml" href="/icons/ala.svg" />
        <link rel="icon" type="image/png" href="/icons/ala.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        
        <title>Ala Regenerate Madagascar's Future</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <AuthProvider>
          <LanguageWatcher />
          <Outlet />
        </AuthProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}
