"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"

const subscribeNoop = () => () => {}
const getMounted = () => true
const getServerMounted = () => false

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getMounted,
    getServerMounted,
  )
  const { theme, setTheme } = useTheme()
  const isDark = mounted && theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}
