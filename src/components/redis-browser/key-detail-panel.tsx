'use client'

import { Check, Copy, FileSearch, Pencil, Save, Trash2 } from 'lucide-react'
import { useActionState, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { deleteKey, fetchKeyDetail, updateStringKey } from '@/app/actions/redis-actions'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { RedisKeyDetailResult, RedisKeyUpdateResult } from '@/types/redis-browser'

const initialResult: RedisKeyDetailResult = { ok: false, key: '', error: 'Select a key' }
const updateInitial: RedisKeyUpdateResult = { ok: true, key: '' }

/**
 * Props for the KeyDetailPanel component.
 * @property {string | null} selectedKey - Currently selected key.
 * @example
 * <KeyDetailPanel selectedKey={key} />
 */
export type KeyDetailPanelProps = {
  selectedKey: string | null
}

/**
 * Render details for a selected Redis key.
 * @example
 * <KeyDetailPanel selectedKey={key} />
 */
export const KeyDetailPanel = ({ selectedKey }: KeyDetailPanelProps) => {
  const [detail, detailAction, detailPending] = useActionState(fetchKeyDetail, initialResult)
  const [updateState, updateAction, updatePending] = useActionState(updateStringKey, updateInitial)
  const [deleteState, deleteAction, deletePending] = useActionState(deleteKey, updateInitial)
  const [copied, setCopied] = useState(false)
  const [draftValue, setDraftValue] = useState('')
  const [draftTtl, setDraftTtl] = useState('')

  useEffect(() => {
    if (!selectedKey) return
    const formData = new FormData()
    formData.set('key', selectedKey)
    detailAction(formData)
  }, [selectedKey, detailAction])

  useEffect(() => {
    if (detail.ok) {
      setDraftValue(detail.valueText ?? '')
      setDraftTtl(detail.ttl != null ? String(detail.ttl) : '')
    }
  }, [detail])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [copied])

  useEffect(() => {
    if (updateState.ok && updateState.key) {
      toast.success('Key updated.')
    } else if (!updateState.ok && updateState.error) {
      toast.error(updateState.error)
    }
  }, [updateState])

  useEffect(() => {
    if (deleteState.ok && deleteState.key) {
      toast.success('Key deleted.')
      setDraftValue('')
      setDraftTtl('')
    } else if (!deleteState.ok && deleteState.error) {
      toast.error(deleteState.error)
    }
  }, [deleteState])

  const handleCopy = async () => {
    if (!detail.valueText) return
    await navigator.clipboard.writeText(detail.valueText)
    setCopied(true)
  }

  const canEditString = useMemo(() => detail.ok && detail.type === 'string', [detail])

  return (
    <CardContent className="space-y-4 min-w-0">
      {!selectedKey ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileSearch className="size-4" />
          Select a key to view its value.
        </div>
      ) : detailPending ? (
        <p className="text-sm text-muted-foreground">Loading key...</p>
      ) : detail.ok ? (
        <div className="space-y-3 min-w-0">
          <div className="space-y-1 min-w-0">
            <p className="text-sm font-semibold text-foreground break-all">{detail.key}</p>
            <p className="text-xs text-muted-foreground">
              Type: {detail.type} · TTL: {detail.ttl}
            </p>
          </div>

          <div className="rounded-md border border-border bg-muted/30">
            <div className="flex items-center justify-between border-b border-border px-3 py-2 text-xs text-muted-foreground">
              <span>Value</span>
              <div className="flex items-center gap-2">
                {canEditString ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" variant="ghost" size="sm">
                        <Pencil className="size-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit value</DialogTitle>
                        <DialogDescription>Update the string value and TTL.</DialogDescription>
                      </DialogHeader>
                      <form action={updateAction} className="space-y-3">
                        <input type="hidden" name="key" value={detail.key} />
                        <Input name="ttl" value={draftTtl} onChange={event => setDraftTtl(event.target.value)} placeholder="TTL (seconds, 0=persist)" />
                        <textarea
                          name="value"
                          value={draftValue}
                          onChange={event => setDraftValue(event.target.value)}
                          className="min-h-[200px] w-full rounded-md border border-border bg-muted/30 p-3 text-xs text-foreground"
                        />
                        <DialogFooter>
                          <Button type="submit" disabled={updatePending}>
                            <Save className="size-4" />
                            {updatePending ? 'Saving...' : 'Save'}
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            disabled={deletePending}
                            onClick={() => {
                              const formData = new FormData()
                              formData.set('key', detail.key)
                              deleteAction(formData)
                            }}
                          >
                            <Trash2 className="size-4" />
                            {deletePending ? 'Deleting...' : 'Delete'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : null}
                <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
            {detail.highlightedHtml ? (
              <div
                className="text-xs text-foreground [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-3 [&_pre]:overflow-auto"
                dangerouslySetInnerHTML={{ __html: detail.highlightedHtml }}
              />
            ) : (
              <pre className="max-h-[360px] overflow-auto p-3 text-xs text-foreground whitespace-pre-wrap break-words">{detail.valueText ?? ''}</pre>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-destructive">{detail.error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!selectedKey}
            onClick={() => {
              if (!selectedKey) return
              const formData = new FormData()
              formData.set('key', selectedKey)
              detailAction(formData)
            }}
          >
            Retry
          </Button>
        </div>
      )}
    </CardContent>
  )
}
