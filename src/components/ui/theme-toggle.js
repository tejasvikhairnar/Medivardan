"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-9 h-9"
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 border-medivardaan-teal/30 dark:border-medivardaan-teal/40 bg-gradient-to-br from-medivardaan-teal/5 to-medivardaan-blue/5 dark:bg-gradient-to-br dark:from-medivardaan-blue/10 dark:to-medivardaan-teal/10 hover:bg-medivardaan-teal/10 dark:hover:bg-medivardaan-teal/20"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-medivardaan-teal transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-medivardaan-blue transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
