import { describe, expect, it, rs } from '@rstest/core'
import { act, renderHook } from '@testing-library/react'
import * as React from 'react'

import { useKeyDetailState } from '@/hooks/use-key-detail-state'
import type { RedisKeyDetailResult, RedisKeyUpdateResult } from '@/types/redis-browser'

const makeDetail = (overrides?: Partial<RedisKeyDetailResult>): RedisKeyDetailResult => ({
  ok: true,
  key: 'user:1',
  type: 'string',
  ttl: 10,
  valueText: '{"name":"Ada"}',
  ...overrides
})

const makeUpdate = (overrides?: Partial<RedisKeyUpdateResult>): RedisKeyUpdateResult => ({
  ok: true,
  key: '',
  ...overrides
})

describe('useKeyDetailState', () => {
  rs.spyOn(React, 'useTransition').mockImplementation(() => [false, (callback: () => void) => callback()])

  it('fetches detail when selected key changes', () => {
    const detailAction = rs.fn()
    renderHook(() =>
      useKeyDetailState({
        selectedKey: 'user:1',
        detail: makeDetail(),
        updateState: makeUpdate(),
        deleteState: makeUpdate(),
        detailAction,
        deleteAction: rs.fn(),
        notify: { success: rs.fn(), error: rs.fn() }
      })
    )

    expect(detailAction).toHaveBeenCalledTimes(1)
    const payload = detailAction.mock.calls[0][0] as FormData
    expect(payload.get('key')).toBe('user:1')
  })

  it('hydrates drafts from detail and handles delete action', () => {
    const deleteAction = rs.fn()
    const { result } = renderHook(() =>
      useKeyDetailState({
        selectedKey: 'user:1',
        detail: makeDetail({ valueText: 'hello', ttl: 30 }),
        updateState: makeUpdate(),
        deleteState: makeUpdate(),
        detailAction: rs.fn(),
        deleteAction,
        notify: { success: rs.fn(), error: rs.fn() }
      })
    )

    expect(result.current.draftValue).toBe('hello')
    expect(result.current.draftTtl).toBe('30')
    expect(result.current.canEditString).toBe(true)

    act(() => {
      result.current.handleDelete()
    })

    const payload = deleteAction.mock.calls[0][0] as FormData
    expect(payload.get('key')).toBe('user:1')
  })

  it('copies value and resets copied flag after timeout', async () => {
    rs.useFakeTimers()

    const copyToClipboard = rs.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      useKeyDetailState({
        selectedKey: 'user:1',
        detail: makeDetail({ valueText: 'content' }),
        updateState: makeUpdate(),
        deleteState: makeUpdate(),
        detailAction: rs.fn(),
        deleteAction: rs.fn(),
        notify: { success: rs.fn(), error: rs.fn() },
        copyToClipboard
      })
    )

    await act(async () => {
      await result.current.handleCopy()
    })

    expect(copyToClipboard).toHaveBeenCalledWith('content')
    expect(result.current.copied).toBe(true)

    act(() => {
      rs.advanceTimersByTime(1500)
    })

    expect(result.current.copied).toBe(false)
    rs.useRealTimers()
  })

  it('emits notifications for update/delete results', () => {
    const success = rs.fn()
    const error = rs.fn()

    renderHook(() =>
      useKeyDetailState({
        selectedKey: 'user:1',
        detail: makeDetail(),
        updateState: makeUpdate({ ok: false, error: 'Update failed', key: 'user:1' }),
        deleteState: makeUpdate({ ok: true, key: 'user:1' }),
        detailAction: rs.fn(),
        deleteAction: rs.fn(),
        notify: { success, error }
      })
    )

    expect(error).toHaveBeenCalledWith('Update failed')
    expect(success).toHaveBeenCalledWith('Key deleted.')
  })

  it('retries only when there is a selected key', () => {
    const detailAction = rs.fn()
    const { result, rerender } = renderHook(
      ({ selectedKey }) =>
        useKeyDetailState({
          selectedKey,
          detail: makeDetail(),
          updateState: makeUpdate(),
          deleteState: makeUpdate(),
          detailAction,
          deleteAction: rs.fn(),
          notify: { success: rs.fn(), error: rs.fn() }
        }),
      {
        initialProps: {
          selectedKey: null as string | null
        }
      }
    )

    act(() => {
      result.current.handleRetry()
    })

    expect(detailAction).toHaveBeenCalledTimes(0)

    rerender({ selectedKey: 'user:1' })

    act(() => {
      result.current.handleRetry()
    })

    expect(detailAction).toHaveBeenCalledTimes(2)
  })
})
