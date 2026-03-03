'use client'

import { CheckDouble, Database, Pencil, PlugConnection } from '@gravity-ui/icons'
import { Button, Card, Icon, Label, Select } from '@gravity-ui/uikit'
import { useMemo, useState } from 'react'

import { ConnectionSettingsModal } from '@/components/connection-manager/connection-settings-modal'
import { useConnectionCardState } from '@/hooks/use-connection-card-state'
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { name, setName, selectedDb, dbFormRef, handleSelectedDbChange } = useConnectionCardState({
    connectionName: connection.name,
    activeDb,
    isActive
  })

  const dbOptions = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, index) => ({
        value: String(index),
        content: `DB ${index}`
      })),
    []
  )

  return (
    <Card theme={isActive ? 'success' : 'normal'} className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{connection.name}</p>
          <p className="text-xs text-muted-foreground break-all">{connection.url}</p>
        </div>
        <div className="flex items-center gap-2">
          {isActive ? (
            <Label theme="success" size="xs">
              active
            </Label>
          ) : null}
          {connection.lastTestStatus ? (
            <Label theme={connection.lastTestStatus === 'ok' ? 'success' : 'danger'} size="xs">
              {connection.lastTestStatus}
            </Label>
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
          <Button type="submit" view="outlined" size="s" disabled={isActive}>
            <Icon data={CheckDouble} />
            {isActive ? 'Active' : 'Activate'}
          </Button>
        </form>

        <form ref={dbFormRef} action={setDatabaseAction}>
          <input type="hidden" name="id" value={connection.id} />
          <input type="hidden" name="db" value={selectedDb} />
          <Select size="s" width={120} value={[selectedDb]} onUpdate={value => handleSelectedDbChange(value[0] ?? '0')} options={dbOptions} placeholder="DB" />
        </form>

        <form action={openBrowserAction}>
          <input type="hidden" name="id" value={connection.id} />
          <Button type="submit" view="flat" size="s" disabled={connection.lastTestStatus !== 'ok'}>
            <Icon data={Database} />
            Browser
          </Button>
        </form>

        <Button type="button" loading={testPending} view="flat" size="s" disabled={testPending} onClick={() => testAction(connection.id)}>
          <Icon data={PlugConnection} />
          Test
        </Button>

        <Button type="button" view="flat" size="s" onClick={() => setIsSettingsOpen(true)}>
          <Icon data={Pencil} />
        </Button>

        <ConnectionSettingsModal
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          connectionId={connection.id}
          name={name}
          onNameChange={setName}
          renameAction={renameAction}
          deleteAction={deleteAction}
        />
      </div>
    </Card>
  )
}
