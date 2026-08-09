import { Moon, Sun } from "lucide-solid";
import { Button } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n";
import { useTheme } from "~/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      aria-label={theme() === "dark" ? t("theme_light") : t("theme_dark")}
      onClick={toggle}
    >
      {theme() === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
