'use client'

import { ArrowDown, Eye, Magnifier } from '@gravity-ui/icons'
import { Button, Card, Icon, Text, TextInput } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useActionState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { scanKeys } from '@/app/actions/redis-actions'
import { useKeyListState } from '@/hooks/use-key-list-state'
import { cn } from '@/lib/utils'
import type { KeyListProps, RedisScanResult } from '@/types/redis-browser'

const initialResult: RedisScanResult = { cursor: '0', items: [], done: true }
const searchSchema = z.object({
  pattern: z.string().trim().optional()
})

type SearchValues = z.infer<typeof searchSchema>

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
  const { control, handleSubmit, setValue } = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      pattern
    }
  })

  useEffect(() => {
    if (scanState.connectionLost && scanState.error) {
      onConnectionLost?.(scanState.error)
    }
  }, [scanState.connectionLost, scanState.error, onConnectionLost])

  useEffect(() => {
    setValue('pattern', pattern)
  }, [pattern, setValue])

  const handleSearchSubmit = handleSubmit(values => {
    const nextPattern = values.pattern?.trim() ?? ''
    setPattern(nextPattern)
    const formData = new FormData()
    formData.set('pattern', nextPattern)
    handleSearch(formData)
  })

  const handleLoadMoreSubmit = () => {
    const formData = new FormData()
    formData.set('cursor', cursor)
    formData.set('pattern', pattern)
    formData.set('count', '100')
    handleLoadMore(formData)
  }

  return (
    <div className="space-y-4 mt-4">
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-2">
        <Controller
          control={control}
          name="pattern"
          render={({ field }) => {
            const { ref, onChange, ...inputField } = field

            return (
              <TextInput
                {...inputField}
                placeholder="Pattern (e.g. user:*)"
                controlRef={ref}
                onUpdate={value => {
                  onChange(value)
                  setPattern(value)
                }}
              />
            )
          }}
        />
        <Button type="submit" loading={scanPending} view="outlined" disabled={scanPending}>
          <Icon data={Magnifier} />
          Search
        </Button>
      </form>

      {scanState.error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4">
          <Text variant="body-2" color="danger">
            {scanState.error}
          </Text>
        </div>
      ) : !activeConnectionId ? (
        <div className="rounded-md border border-border bg-card p-4">
          <Text variant="body-2" color="secondary">
            Select an active connection to browse keys.
          </Text>
        </div>
      ) : (
        <Card className="p-0">
          <div className="grid grid-cols-[1fr_120px_80px_40px] gap-2 px-4 py-2">
            <Text as="span" variant="body-2" color="secondary">
              Key
            </Text>
            <Text as="span" variant="body-2" color="secondary">
              Type
            </Text>
            <Text as="span" variant="body-2" color="secondary">
              TTL
            </Text>
            <span />
          </div>
          {items.length === 0 ? (
            <div className="px-4 py-6">
              <Text variant="body-2" color="secondary">
                No keys found.
              </Text>
            </div>
          ) : (
            <ul>
              {items.map(item => (
                <li key={item.key} className={cn('grid grid-cols-[1fr_120px_80px_40px] gap-2 px-4 py-2 text-sm', selectedKey === item.key ? 'bg-muted/40' : 'bg-transparent')}>
                  <Text as="span" variant="body-2" ellipsis>
                    {item.key}
                  </Text>
                  <Text as="span" variant="body-2" color="secondary">
                    {item.type}
                  </Text>
                  <Text as="span" variant="body-2" color="secondary">
                    {item.ttl}
                  </Text>
                  <Button type="button" view="flat" size="s" onClick={() => onSelect(item.key)}>
                    <Icon data={Eye} />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      <form
        onSubmit={event => {
          event.preventDefault()
          handleLoadMoreSubmit()
        }}
      >
        <Button type="submit" view="outlined" disabled={scanPending || scanState.done || !activeConnectionId}>
          <Icon data={ArrowDown} />
          {scanState.done ? 'End' : 'Load more'}
        </Button>
      </form>
    </div>
  )
}
