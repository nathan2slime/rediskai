import { ArrowLeft } from '@gravity-ui/icons'
import { Button, Icon } from '@gravity-ui/uikit'
import Link from 'next/link'

import { AppShell } from '@/components/layout/app-shell'
import { BrowserView } from '@/components/redis-browser'
import { ConnectionLostDialog } from '@/components/redis-browser/connection-lost-dialog'
import { getConnectionsState } from '@/lib/connections-store'

const BrowserPage = async () => {
  const state = await getConnectionsState()
  const active = state.connections.find(connection => connection.id === state.activeId)

  const isStable = Boolean(active && active.lastTestStatus === 'ok')

  return (
    <AppShell>
      <div className="space-y-2">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/connections">
              <Button view="outlined" size="m">
                <Icon data={ArrowLeft} />
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
        {isStable ? (
          <BrowserView activeConnectionId={state.activeId} />
        ) : (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
            <p className="font-semibold">Connection unavailable</p>
            <p>Run a connection test from the home screen before opening the browser.</p>
            <div className="mt-4">
              <Link href="/">
                <Button type="button" view="outlined">
                  Back to home
                </Button>
              </Link>
            </div>
            <ConnectionLostDialog open title="Connection unavailable" description="The Redis connection is not stable. Returning to the home screen." />
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default BrowserPage
