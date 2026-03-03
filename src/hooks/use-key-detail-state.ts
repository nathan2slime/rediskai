import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'

import type { RedisKeyDetailResult, RedisKeyUpdateResult } from '@/types/redis-browser'

type NotifyApi = {
  success: (message: string) => void
  error: (message: string) => void
}

type UseKeyDetailStateParams = {
  selectedKey: string | null
  detail: RedisKeyDetailResult
  updateState: RedisKeyUpdateResult
  deleteState: RedisKeyUpdateResult
  detailAction: (formData: FormData) => void
  deleteAction: (formData: FormData) => void
  notify: NotifyApi
  copyToClipboard?: (text: string) => Promise<void>
}

const defaultCopyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
}

const buildSingleKeyFormData = (key: string) => {
  const formData = new FormData()
  formData.set('key', key)
  return formData
}

export const useKeyDetailState = ({
  selectedKey,
  detail,
  updateState,
  deleteState,
  detailAction,
  deleteAction,
  notify,
  copyToClipboard = defaultCopyToClipboard
}: UseKeyDetailStateParams) => {
  const [copied, setCopied] = useState(false)
  const [draftValue, setDraftValue] = useState('')
  const [draftTtl, setDraftTtl] = useState('')
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (!selectedKey) return
    startTransition(() => {
      detailAction(buildSingleKeyFormData(selectedKey))
    })
  }, [selectedKey, detailAction])

  useEffect(() => {
    if (detail.ok) {
      setDraftValue(detail.valueText ?? '')
      setDraftTtl(detail.ttl != null ? String(detail.ttl) : '')
    }
  }, [detail.ok, detail.valueText, detail.ttl])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [copied])

  useEffect(() => {
    if (updateState.ok && updateState.key) {
      notify.success('Key updated.')
    } else if (!updateState.ok && updateState.error) {
      notify.error(updateState.error)
    }
  }, [notify, updateState])

  useEffect(() => {
    if (deleteState.ok && deleteState.key) {
      notify.success('Key deleted.')
      setDraftValue('')
      setDraftTtl('')
    } else if (!deleteState.ok && deleteState.error) {
      notify.error(deleteState.error)
    }
  }, [deleteState, notify])

  const handleCopy = useCallback(async () => {
    if (!detail.valueText) return
    await copyToClipboard(detail.valueText)
    setCopied(true)
  }, [copyToClipboard, detail.valueText])

  const handleDelete = useCallback(() => {
    if (!detail.key) return
    startTransition(() => {
      deleteAction(buildSingleKeyFormData(detail.key))
    })
  }, [deleteAction, detail.key])

  const handleRetry = useCallback(() => {
    if (!selectedKey) return
    startTransition(() => {
      detailAction(buildSingleKeyFormData(selectedKey))
    })
  }, [detailAction, selectedKey])

  const canEditString = useMemo(() => detail.ok && detail.type === 'string', [detail.ok, detail.type])

  return {
    copied,
    draftValue,
    draftTtl,
    canEditString,
    setDraftValue,
    setDraftTtl,
    handleCopy,
    handleDelete,
    handleRetry
  }
}
