import { act, renderHook } from '@testing-library/react'

import { useConnectionTestAction } from '@/hooks/use-connection-test-action'

const testConnectionMock = vi.fn()

vi.mock('@/app/actions/connection-actions', () => ({
  testConnection: (...args: unknown[]) => testConnectionMock(...(args as [{ ok: boolean; error?: string; latencyMs?: number }, FormData]))
}))

describe('useConnectionTestAction', () => {
  it('runs test action and clears pending id on success', async () => {
    testConnectionMock.mockResolvedValueOnce({ ok: true })

    const error = vi.fn()
    const { result } = renderHook(() => useConnectionTestAction({ notify: { error } }))

    await act(async () => {
      await result.current.handleTest('conn-1')
    })

    expect(testConnectionMock).toHaveBeenCalledTimes(1)
    const payload = testConnectionMock.mock.calls[0][1] as FormData
    expect(payload.get('id')).toBe('conn-1')
    expect(result.current.pendingTestId).toBeNull()
    expect(error).not.toHaveBeenCalled()
  })

  it('notifies when test action fails', async () => {
    testConnectionMock.mockResolvedValueOnce({
      ok: false,
      error: 'Failed'
    })

    const error = vi.fn()
    const { result } = renderHook(() => useConnectionTestAction({ notify: { error } }))

    await act(async () => {
      await result.current.handleTest('conn-2')
    })

    expect(error).toHaveBeenCalledWith('Connection is closed.')
    expect(result.current.pendingTestId).toBeNull()
  })
})
