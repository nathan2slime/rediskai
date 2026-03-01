'use client'

import { Moon, Sun } from '@gravity-ui/icons'
import { Button, Icon } from '@gravity-ui/uikit'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

/**
 * Theme toggle button.
 * @example
 * <ThemeToggle />
 */
export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <Button type="button" variant="ghost" size="m" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label="Toggle theme">
      {isDark ? <Icon data={Sun} /> : <Icon data={Moon} />}
    </Button>
  )
}
