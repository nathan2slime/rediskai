import { Logo } from '@/components/brand/logo'
import { ConnectionManager } from '@/components/connection-manager'
import { AppShell } from '@/components/layout/app-shell'
import { ThemePresets } from '@/components/theme/theme-presets'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { getConnectionsState } from '@/lib/connections-store'

const ConnectionsPage = async () => {
  const state = await getConnectionsState()

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Logo className="size-5" />
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Rediskai</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemePresets />
            <ThemeToggle />
          </div>
        </header>
        <ConnectionManager state={state} />
      </div>
    </AppShell>
  )
}

export default ConnectionsPage
