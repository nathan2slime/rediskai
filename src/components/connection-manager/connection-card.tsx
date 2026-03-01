'use client'

import { CheckCircle2, Database, Pencil, RefreshCw, Settings, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useConnectionCardState } from '@/hooks/use-connection-card-state'
import { cn } from '@/lib/utils'
import type { ConnectionCardProps } from '@/types/connection-manager'
import { formatDateTime } from '@/utils/formatters'

/**
 * Single connection row with actions.
 * @example
 * <ConnectionCard connection={item} isActive={false} testPending={false} setActiveAction={setActive} setDatabaseAction={setDb} renameAction={rename} testAction={test} deleteAction={remove} openBrowserAction={openBrowser} activeDb={0} />
 */
export const ConnectionCard = ({
  connection,
  isActive,
  testPending,
  setActiveAction,
  setDatabaseAction,
  renameAction,
  testAction,
  deleteAction,
  activeDb,
  openBrowserAction
}: ConnectionCardProps) => {
  const { name, setName, selectedDb, dbFormRef, handleSelectedDbChange } = useConnectionCardState({
    connectionName: connection.name,
    activeDb,
    isActive
  })

  const renameFormId = `rename-${connection.id}`
  const deleteFormId = `delete-${connection.id}`

  return (
    <div className={cn('rounded-lg border border-border bg-card p-4 shadow-sm', isActive ? 'border-emerald-400/60 bg-emerald-500/5 shadow-emerald-500/10' : '')}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{connection.name}</p>
          <p className="text-xs text-muted-foreground break-all">{connection.url}</p>
        </div>
        <div className="flex items-center gap-2">
          {isActive ? <Badge className="border-emerald-300/40 bg-emerald-500/10 text-emerald-400">active</Badge> : null}
          {connection.lastTestStatus ? (
            <Badge className={connection.lastTestStatus === 'ok' ? 'border-emerald-300/40 bg-emerald-500/10 text-emerald-400' : 'border-red-300/40 bg-red-500/10 text-red-400'}>
              {connection.lastTestStatus}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Last test: {formatDateTime(connection.lastTestedAt)}</span>
        {connection.lastTestLatencyMs ? <span>latency: {connection.lastTestLatencyMs}ms</span> : null}
        {connection.lastTestError ? <span className="text-red-400">{connection.lastTestError}</span> : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <form action={setActiveAction}>
          <input type="hidden" name="id" value={connection.id} />
          <Button type="submit" variant="outline" size="sm" disabled={isActive}>
            <CheckCircle2 className="size-4" />
            {isActive ? 'Active' : 'Activate'}
          </Button>
        </form>

        <form ref={dbFormRef} action={setDatabaseAction}>
          <input type="hidden" name="id" value={connection.id} />
          <input type="hidden" name="db" value={selectedDb} />
          <Select value={selectedDb} onValueChange={handleSelectedDbChange}>
            <SelectTrigger size="sm" className="w-[120px]">
              <SelectValue placeholder="DB" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 16 }).map((_, index) => (
                <SelectItem key={index} value={String(index)}>
                  DB {index}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </form>

        <form action={openBrowserAction}>
          <input type="hidden" name="id" value={connection.id} />
          <Button type="submit" variant="ghost" size="sm" disabled={connection.lastTestStatus !== 'ok'}>
            <Database className="size-4" />
            Browser
          </Button>
        </form>

        <Button type="button" variant="ghost" size="sm" disabled={testPending} onClick={() => testAction(connection.id)}>
          <RefreshCw className={testPending ? 'size-4 animate-spin' : 'size-4'} />
          {testPending ? 'Testing...' : 'Test'}
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <Settings className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connection settings</DialogTitle>
              <DialogDescription>Edit or delete this connection.</DialogDescription>
            </DialogHeader>

            <form id={renameFormId} action={renameAction} className="space-y-3">
              <input type="hidden" name="id" value={connection.id} />
              <Input name="name" value={name} onChange={event => setName(event.target.value)} />
            </form>

            <form id={deleteFormId} action={deleteAction} className="hidden">
              <input type="hidden" name="id" value={connection.id} />
            </form>

            <div className="border-t border-border pt-4">
              <DialogFooter className="flex flex-wrap gap-2 sm:justify-end">
                <Button type="submit" variant="destructive" form={deleteFormId}>
                  <Trash2 className="size-4" />
                  Delete
                </Button>
                <Button type="submit" variant="outline" form={renameFormId}>
                  <Pencil className="size-4" />
                  Rename
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
