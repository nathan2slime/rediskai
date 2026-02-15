import { useCallback, useEffect, useState } from 'react'

import type { RedisKeyInfo, RedisScanResult } from '@/types/redis-browser'

type ScanMode = 'search' | 'more'

type UseKeyListStateParams = {
  activeConnectionId: string | null
  scanState: RedisScanResult
  scanAction: (formData: FormData) => void
}

const applyScanDefaults = (formData: FormData, cursor: string, pattern: string) => {
  formData.set('cursor', cursor)
  formData.set('pattern', pattern)
  formData.set('count', '100')
}

export const useKeyListState = ({ activeConnectionId, scanState, scanAction }: UseKeyListStateParams) => {
  const [pattern, setPattern] = useState('*')
  const [cursor, setCursor] = useState('0')
  const [mode, setMode] = useState<ScanMode>('search')
  const [items, setItems] = useState<RedisKeyInfo[]>([])

  useEffect(() => {
    if (mode === 'search') {
      setItems(scanState.items)
    } else {
      setItems(prev => [...prev, ...scanState.items])
    }
    setCursor(scanState.cursor)
  }, [mode, scanState.cursor, scanState.items])

  useEffect(() => {
    setItems([])
    setCursor('0')
    setMode('search')
  }, [activeConnectionId])

  const handleSearch = useCallback(
    (formData: FormData) => {
      applyScanDefaults(formData, '0', pattern)
      setMode('search')
      setCursor('0')
      scanAction(formData)
    },
    [pattern, scanAction]
  )

  const handleLoadMore = useCallback(
    (formData: FormData) => {
      applyScanDefaults(formData, cursor, pattern)
      setMode('more')
      scanAction(formData)
    },
    [cursor, pattern, scanAction]
  )

  return {
    pattern,
    setPattern,
    items,
    cursor,
    handleSearch,
    handleLoadMore
  }
}
