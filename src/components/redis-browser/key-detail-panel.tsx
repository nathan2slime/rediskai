'use client'

import { Check, Copy, Pencil } from '@gravity-ui/icons'
import { Database } from '@gravity-ui/illustrations'
import { Button, Card, Icon, Text } from '@gravity-ui/uikit'
import { useActionState, useEffect, useState } from 'react'

import { deleteKey, fetchKeyDetail, updateStringKey } from '@/app/actions/redis-actions'
import { KeyDetailEditModal } from '@/components/redis-browser/key-detail-edit-modal'
import { useKeyDetailState } from '@/hooks/use-key-detail-state'
import { notifyError, notifySuccess } from '@/lib/toaster'
import type { RedisKeyDetailResult, RedisKeyUpdateResult } from '@/types/redis-browser'

const initialResult: RedisKeyDetailResult = {
  ok: false,
  key: '',
  error: 'Select a key'
}
const updateInitial: RedisKeyUpdateResult = { ok: true, key: '' }

/**
 * Props for the KeyDetailPanel component.
 * @property {string | null} selectedKey - Currently selected key.
 * @example
 * <KeyDetailPanel selectedKey={key} />
 */
export type KeyDetailPanelProps = {
  selectedKey: string | null
  onConnectionLost?: (message: string) => void
}

/**
 * Render details for a selected Redis key.
 * @example
 * <KeyDetailPanel selectedKey={key} />
 */
export const KeyDetailPanel = ({ selectedKey, onConnectionLost }: KeyDetailPanelProps) => {
  const [detail, detailAction, detailPending] = useActionState(fetchKeyDetail, initialResult)
  const [updateState, updateAction, updatePending] = useActionState(updateStringKey, updateInitial)
  const [deleteState, deleteAction, deletePending] = useActionState(deleteKey, updateInitial)
  const { copied, draftValue, draftTtl, canEditString, setDraftValue, setDraftTtl, handleCopy, handleDelete, handleRetry } = useKeyDetailState({
    selectedKey,
    detail,
    updateState,
    deleteState,
    detailAction,
    deleteAction,
    notify: {
      success: notifySuccess,
      error: notifyError
    }
  })
  const [isEditOpen, setIsEditOpen] = useState(false)

  useEffect(() => {
    if (detail.connectionLost && detail.error) {
      onConnectionLost?.(detail.error)
    }
  }, [detail.connectionLost, detail.error, onConnectionLost])

  useEffect(() => {
    if (updateState.connectionLost && updateState.error) {
      onConnectionLost?.(updateState.error)
    }
  }, [updateState.connectionLost, updateState.error, onConnectionLost])

  useEffect(() => {
    if (deleteState.connectionLost && deleteState.error) {
      onConnectionLost?.(deleteState.error)
    }
  }, [deleteState.connectionLost, deleteState.error, onConnectionLost])

  return (
    <div className="space-y-4 min-w-0">
      {!selectedKey ? (
        <div className="flex flex-col items-center gap-2 text-sm">
          <Database className="size-30" />
          <Text variant="body-1">No key selected</Text>
        </div>
      ) : detailPending ? (
        <Text variant="body-2" color="secondary">
          Loading key...
        </Text>
      ) : detail.ok ? (
        <div className="space-y-3 min-w-0">
          <div className="space-y-1 min-w-0">
            <Text variant="body-2" color="misc" className="font-semibold break-all">
              Key: {detail.key}
            </Text>
            &nbsp;·&nbsp;
            <Text variant="body-2" color="secondary">
              Type: {detail.type}
            </Text>
            &nbsp;·&nbsp;
            <Text variant="body-2" color="positive">
              TTL:&nbsp;
              {(detail.ttl || 0) >= 0 ? `${detail.ttl} seconds` : 'No expire'}
            </Text>
          </div>

          <Card className="rounded-md">
            <div className="flex items-center justify-between px-3 py-2">
              <Text as="span" variant="body-1" color="secondary">
                Value
              </Text>
              <div className="flex items-center gap-2">
                {canEditString ? (
                  <Button type="button" view="flat" size="s" onClick={() => setIsEditOpen(true)}>
                    <Icon data={Pencil} />
                    Edit
                  </Button>
                ) : null}
                <Button type="button" view="flat" size="s" onClick={handleCopy}>
                  {copied ? <Icon data={Check} /> : <Icon data={Copy} />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
            {detail.highlightedHtml ? (
              <div className="[&_pre]:m-0 [&_pre]:p-3  [&_pre]:bg-transparent [&_pre]:overflow-auto" dangerouslySetInnerHTML={{ __html: detail.highlightedHtml }} />
            ) : (
              <div className="max-h-90 overflow-auto p-3">
                <Text as="pre" variant="body-2" className="whitespace-pre-wrap break-words">
                  {detail.valueText ?? ''}
                </Text>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <div className="space-y-2">
          <Text variant="body-2" color="danger">
            {detail.error}
          </Text>
          <Button type="button" view="outlined" size="s" disabled={!selectedKey} onClick={handleRetry}>
            Retry
          </Button>
        </div>
      )}
      {detail.ok ? (
        <KeyDetailEditModal
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          keyName={detail.key}
          draftValue={draftValue}
          draftTtl={draftTtl}
          setDraftValue={setDraftValue}
          setDraftTtl={setDraftTtl}
          onSubmit={updateAction}
          onDelete={handleDelete}
          deletePending={deletePending}
          updatePending={updatePending}
        />
      ) : null}
    </div>
  )
}
