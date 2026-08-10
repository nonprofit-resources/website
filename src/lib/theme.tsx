import {
  createContext,
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

export const STORAGE_KEY = "nr-theme";

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Apply without transition (boot / SSR hydrate). */
function applyThemeInstant(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("theme-transition");
  root.classList.toggle("dark", theme === "dark");
  root.dataset.kbTheme = theme;
  root.style.colorScheme = theme;
}

/** Apply with transition (user toggle). */
function applyThemeAnimated(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  root.classList.toggle("dark", theme === "dark");
  root.dataset.kbTheme = theme;
  root.style.colorScheme = theme;
  window.setTimeout(() => root.classList.remove("theme-transition"), 360);
}

export function ThemeProvider(props: ParentProps) {
  const [theme, setThemeSignal] = createSignal<Theme>("light");
  const [userLocked, setUserLocked] = createSignal(false);
  let booted = false;

  onMount(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      setUserLocked(true);
      setThemeSignal(stored);
      applyThemeInstant(stored);
    } else {
      const sys = systemTheme();
      setThemeSignal(sys);
      applyThemeInstant(sys);
    }
    booted = true;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (userLocked()) return;
      const next = mq.matches ? "dark" : "light";
      setThemeSignal(next);
      applyThemeAnimated(next);
    };
    mq.addEventListener("change", onChange);
    onCleanup(() => mq.removeEventListener("change", onChange));
  });

  const setTheme = (t: Theme) => {
    setUserLocked(true);
    localStorage.setItem(STORAGE_KEY, t);
    setThemeSignal(t);
    if (booted) applyThemeAnimated(t);
    else applyThemeInstant(t);
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
