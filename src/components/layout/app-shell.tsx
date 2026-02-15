import type { PropsWithChildren } from 'react'

/**
 * Props for the AppShell component.
 * @property {React.ReactNode} children - Main content for the page.
 * @example
 * <AppShell><div /></AppShell>
 */
export type AppShellProps = PropsWithChildren

/**
 * Layout wrapper without global navigation.
 * @example
 * <AppShell><div /></AppShell>
 */
export const AppShell = ({ children }: AppShellProps) => {
  return <main className="mx-auto min-h-screen w-full max-w-6xl px-page py-8">{children}</main>
}
