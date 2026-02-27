import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className="rounded-full"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Switch
        id="theme-switcher"
        checked={theme === "light"}
        onCheckedChange={toggleTheme}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className="rounded-full"
      >
        <Sun className="h-4 w-4" />
      </Button>
    </div>
  );
}
