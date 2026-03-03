import type { Metadata } from 'next'
import { Baloo_2 } from 'next/font/google'
import type { PropsWithChildren } from 'react'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { ToasterProvider } from '@/components/ui/toaster-provider'

import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Rediskai',
  description: 'Local Redis admin UI'
}

const base = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

/**
 * Root layout wrapper.
 * @example
 * <RootLayout><div /></RootLayout>
 */
const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={base.className}>
        <ThemeProvider>
          <ToasterProvider>{children}</ToasterProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
