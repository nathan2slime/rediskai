import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { AppShell } from '@/components/layout/app-shell'
import { BrowserView } from '@/components/redis-browser'
import { Button } from '@/components/ui/button'
import { getConnectionsState } from '@/lib/connections-store'

const BrowserPage = async () => {
  const state = await getConnectionsState()
  const active = state.connections.find(connection => connection.id === state.activeId)

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/connections">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="size-4" />
                Back
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              {active ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">{active.name}</span>
                  <span className="text-muted-foreground">{active.url}</span>
                  <span className="text-muted-foreground">DB {state.activeDb}</span>
                </div>
              ) : (
                <span>No active connection</span>
              )}
            </div>
          </div>
        </header>
        <BrowserView activeConnectionId={state.activeId} />
      </div>
    </AppShell>
  )
}

export default BrowserPage
