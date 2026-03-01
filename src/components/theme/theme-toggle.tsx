'use client'

import { Moon, Sun } from '@gravity-ui/icons'
import { Button, Icon } from '@gravity-ui/uikit'

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
    <Button type="button" variant="ghost" size="m" onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? <Icon data={Sun} /> : <Icon data={Moon} />}
    </Button>
  )
}
