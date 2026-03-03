'use client'

import { useCallback, useState } from 'react'

import { Card, Divider, Text } from '@gravity-ui/uikit'

import { ConnectionLostDialog } from '@/components/redis-browser/connection-lost-dialog'
import { KeyDetailPanel } from '@/components/redis-browser/key-detail-panel'
import { KeyList } from '@/components/redis-browser/key-list'
import { useBrowserSelection } from '@/hooks/use-browser-selection'

/**
 * Props for the BrowserView component.
 * @property {string | null} activeConnectionId - Active connection id.
 * @example
 * <BrowserView activeConnectionId={state.activeId} />
 */
export type BrowserViewProps = {
  activeConnectionId: string | null
}

/**
 * Two-column browser layout for key list and details.
 * @example
 * <BrowserView activeConnectionId={state.activeId} />
 */
export const BrowserView = ({ activeConnectionId }: BrowserViewProps) => {
  const { selectedKey, setSelectedKey } = useBrowserSelection({
    activeConnectionId
  })
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const handleConnectionLost = useCallback((message: string) => {
    setConnectionError(prev => prev ?? message)
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <ConnectionLostDialog open={Boolean(connectionError)} description={connectionError ?? undefined} />
      <Card className="min-w-0 p-3">
        <div className="space-y-1">
          <Text as="h3" variant="header-1">
            Keys
          </Text>
          <Text as="p" className="text-sm text-muted-foreground">
            Scan keys on the active connection and database
          </Text>
        </div>
        <KeyList activeConnectionId={activeConnectionId} onSelect={setSelectedKey} selectedKey={selectedKey} onConnectionLost={handleConnectionLost} />
      </Card>

      <Card className="min-w-0 p-3">
        <div className="space-y-1">
          <Text as="h3" variant="header-1">
            Details
          </Text>
          <Text as="p" className="text-sm text-muted-foreground">
            Inspect the selected key
          </Text>
        </div>
        <Divider className="w-full my-2" />
        <KeyDetailPanel selectedKey={selectedKey} onConnectionLost={handleConnectionLost} />
      </Card>
    </div>
  )
}
