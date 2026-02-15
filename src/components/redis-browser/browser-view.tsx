'use client'

import { useState } from 'react'

import { KeyDetailPanel } from '@/components/redis-browser/key-detail-panel'
import { KeyList } from '@/components/redis-browser/key-list'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

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
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Keys</CardTitle>
          <p className="text-sm text-muted-foreground">Scan keys on the active connection and database.</p>
        </CardHeader>
        <KeyList activeConnectionId={activeConnectionId} onSelect={setSelectedKey} selectedKey={selectedKey} />
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <p className="text-sm text-muted-foreground">Inspect the selected key.</p>
        </CardHeader>
        <KeyDetailPanel selectedKey={selectedKey} />
      </Card>
    </div>
  )
}
