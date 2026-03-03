'use client'

import { ThemeProvider as GravityProvider } from '@gravity-ui/uikit'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { PropsWithChildren } from 'react'

/**
 * Theme provider wrapper.
 * @example
 * <ThemeProvider><App /></ThemeProvider>
 */
export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <GravityProvider theme="light">
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </NextThemesProvider>
    </GravityProvider>
  )
}
