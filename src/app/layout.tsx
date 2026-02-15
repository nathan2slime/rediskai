import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'
import '@/app/globals.css'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Redisoku Local',
  description: 'Local Redis admin UI'
}

/**
 * Root layout wrapper.
 * @example
 * <RootLayout><div /></RootLayout>
 */
const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
