import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  useContext,
  type ParentProps,
} from "solid-js";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: () => Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>();

const STORAGE_KEY = "nr-theme";

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  root.classList.toggle("dark", theme === "dark");
  root.dataset.kbTheme = theme;
  root.style.colorScheme = theme;
  window.setTimeout(() => root.classList.remove("theme-transition"), 320);
}

export function ThemeProvider(props: ParentProps) {
  const [theme, setThemeSignal] = createSignal<Theme>("light");
  const [userLocked, setUserLocked] = createSignal(false);

  onMount(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      setUserLocked(true);
      setThemeSignal(stored);
      applyTheme(stored);
    } else {
      const sys = systemTheme();
      setThemeSignal(sys);
      applyTheme(sys);
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (userLocked()) return;
      const next = mq.matches ? "dark" : "light";
      setThemeSignal(next);
      applyTheme(next);
    };
    mq.addEventListener("change", onChange);
    onCleanup(() => mq.removeEventListener("change", onChange));
  });

  createEffect(() => {
    const t = theme();
    if (typeof document !== "undefined") applyTheme(t);
  });

  const setTheme = (t: Theme) => {
    setUserLocked(true);
    localStorage.setItem(STORAGE_KEY, t);
    setThemeSignal(t);
    applyTheme(t);
  };

  const toggle = () => setTheme(theme() === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
