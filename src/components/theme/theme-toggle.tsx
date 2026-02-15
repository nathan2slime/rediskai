'use client'

import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useThemeToggle } from '@/hooks/use-theme-toggle'

/**
 * Theme toggle button.
 * @example
 * <ThemeToggle />
 */
export const ThemeToggle = () => {
  const { mounted, isDark, toggleTheme } = useThemeToggle()

  if (!mounted) return null

  return (
    <Button type="button" variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
