'use client'

import { ArrowDown, Eye, Search } from 'lucide-react'
import { useActionState, useEffect } from 'react'

import { scanKeys } from '@/app/actions/redis-actions'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useKeyListState } from '@/hooks/use-key-list-state'
import { cn } from '@/lib/utils'
import type { KeyListProps, RedisScanResult } from '@/types/redis-browser'

const initialResult: RedisScanResult = { cursor: '0', items: [], done: true }

/**
 * List Redis keys with SCAN pagination and filters.
 * @example
 * <KeyList activeConnectionId={state.activeId} onSelect={setKey} selectedKey={key} />
 */
export const KeyList = ({ activeConnectionId, onSelect, selectedKey, onConnectionLost }: KeyListProps) => {
  const [scanState, scanAction, scanPending] = useActionState(scanKeys, initialResult)
  const { pattern, setPattern, items, cursor, handleSearch, handleLoadMore } = useKeyListState({
    activeConnectionId,
    scanState,
    scanAction
  })

  useEffect(() => {
    if (scanState.connectionLost && scanState.error) {
      onConnectionLost?.(scanState.error)
    }
  }, [scanState.connectionLost, scanState.error, onConnectionLost])

  return (
    <CardContent className="space-y-4">
      <form action={handleSearch} className="flex flex-wrap gap-2">
        <Input name="pattern" value={pattern} onChange={event => setPattern(event.target.value)} placeholder="Pattern (e.g. user:*)" />
        <Button type="submit" variant="outline" disabled={scanPending}>
          <Search className="size-4" />
          {scanPending ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {scanState.error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{scanState.error}</div>
      ) : !activeConnectionId ? (
        <div className="rounded-md border border-border bg-card p-4 text-sm text-muted-foreground">Select an active connection to browse keys.</div>
      ) : (
        <div className="rounded-md border border-border bg-card">
          <div className="grid grid-cols-[1fr_120px_80px_40px] gap-2 border-b border-border px-4 py-2 text-xs font-semibold text-muted-foreground">
            <span>Key</span>
            <span>Type</span>
            <span>TTL</span>
            <span />
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">No keys found.</p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map(item => (
                <li key={item.key} className={cn('grid grid-cols-[1fr_120px_80px_40px] gap-2 px-4 py-2 text-sm', selectedKey === item.key ? 'bg-muted/40' : 'bg-transparent')}>
                  <span className="truncate text-foreground">{item.key}</span>
                  <span className="text-muted-foreground">{item.type}</span>
                  <span className="text-muted-foreground">{item.ttl}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => onSelect(item.key)}>
                    <Eye className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form action={handleLoadMore}>
        <input type="hidden" name="cursor" value={cursor} />
        <input type="hidden" name="pattern" value={pattern} />
        <input type="hidden" name="count" value="100" />
        <Button type="submit" variant="outline" disabled={scanPending || scanState.done || !activeConnectionId}>
          <ArrowDown className="size-4" />
          {scanState.done ? 'End' : scanPending ? 'Loading...' : 'Load more'}
        </Button>
      </form>
    </CardContent>
  )
}
