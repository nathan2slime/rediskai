import { useTheme } from 'next-themes'
import { useCallback, useEffect, useMemo, useState } from 'react'

export const useThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = useMemo(() => theme === 'dark', [theme])

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark')
  }, [isDark, setTheme])

  return {
    mounted,
    isDark,
    toggleTheme
  }
}
