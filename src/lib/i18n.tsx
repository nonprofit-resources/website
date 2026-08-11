import {
  createContext,
  createSignal,
  useContext,
  type ParentProps,
} from "solid-js";

export type Locale = "en" | "es" | "fr";

const dict = {
  en: {
    nav_home: "Home",
    nav_services: "Services",
    nav_news: "News",
    nav_guides: "Guides",
    nav_blog: "Blog",
    nav_submit: "Submit",
    nav_account: "Account",
    hero_title: "Find free and discounted tools for nonprofits",
    hero_sub:
      "A living catalog of vendor nonprofit plans, DIY options, and free software — without the sales funnel.",
    cta_browse: "Browse services",
    cta_submit: "Suggest a resource",
    view_grid: "Grid",
    view_list: "List",
    subscribe_title: "Subscribe to news",
    subscribe_placeholder: "you@org.org",
    subscribe_button: "Subscribe",
    footer_product: "Catalog",
    footer_legal: "Legal",
    footer_related: "Partners",
    theme_light: "Light",
    theme_dark: "Dark",
  },
  es: {
    nav_home: "Inicio",
    nav_services: "Servicios",
    nav_news: "Noticias",
    nav_guides: "Guías",
    nav_blog: "Blog",
    nav_submit: "Enviar",
    nav_account: "Cuenta",
    hero_title: "Encuentra herramientas gratuitas y con descuento para ONGs",
    hero_sub:
      "Un catálogo vivo de planes sin fines de lucro, opciones DIY y software libre — sin embudo de ventas.",
    cta_browse: "Ver servicios",
    cta_submit: "Sugerir un recurso",
    view_grid: "Cuadrícula",
    view_list: "Lista",
    subscribe_title: "Suscribirse a noticias",
    subscribe_placeholder: "tu@org.org",
    subscribe_button: "Suscribirse",
    footer_product: "Catálogo",
    footer_legal: "Legal",
    footer_related: "Socios",
    theme_light: "Claro",
    theme_dark: "Oscuro",
  },
  fr: {
    nav_home: "Accueil",
    nav_services: "Services",
    nav_news: "Actualités",
    nav_guides: "Guides",
    nav_blog: "Blog",
    nav_submit: "Proposer",
    nav_account: "Compte",
    hero_title: "Trouvez des outils gratuits et à tarif réduit pour associations",
    hero_sub:
      "Un catalogue vivant de plans nonprofit, options DIY et logiciels libres — sans tunnel commercial.",
    cta_browse: "Parcourir",
    cta_submit: "Suggérer une ressource",
    view_grid: "Grille",
    view_list: "Liste",
    subscribe_title: "S’abonner aux actualités",
    subscribe_placeholder: "vous@org.org",
    subscribe_button: "S’abonner",
    footer_product: "Catalogue",
    footer_legal: "Mentions",
    footer_related: "Partenaires",
    theme_light: "Clair",
    theme_dark: "Sombre",
  },
} as const;

type DictKey = keyof (typeof dict)["en"];

interface I18nValue {
  locale: () => Locale;
  setLocale: (l: Locale) => void;
  t: (key: DictKey) => string;
}

const I18nContext = createContext<I18nValue>();
const STORAGE_KEY = "nr-locale";

export function I18nProvider(props: ParentProps) {
  const [locale, setLocaleSignal] = createSignal<Locale>("en");

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && stored in dict) setLocaleSignal(stored);
  }

  const setLocale = (l: Locale) => {
    setLocaleSignal(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (key: DictKey) => dict[locale()][key] ?? dict.en[key];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>{props.children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
  { id: "fr", label: "FR" },
];
