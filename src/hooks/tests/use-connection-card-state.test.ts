import { act, renderHook } from '@testing-library/react'

import { useConnectionCardState } from '@/hooks/use-connection-card-state'

describe('useConnectionCardState', () => {
  it('syncs name and active db when connection is active', () => {
    const { result, rerender } = renderHook(({ connectionName, activeDb, isActive }) => useConnectionCardState({ connectionName, activeDb, isActive }), {
      initialProps: {
        connectionName: 'Local',
        activeDb: 0,
        isActive: true
      }
    })

    expect(result.current.name).toBe('Local')
    expect(result.current.selectedDb).toBe('0')

    rerender({ connectionName: 'Prod', activeDb: 4, isActive: true })

    expect(result.current.name).toBe('Prod')
    expect(result.current.selectedDb).toBe('4')
  })

  it('does not sync selected db when connection is not active', () => {
    const { result, rerender } = renderHook(({ connectionName, activeDb, isActive }) => useConnectionCardState({ connectionName, activeDb, isActive }), {
      initialProps: {
        connectionName: 'Local',
        activeDb: 0,
        isActive: false
      }
    })

    act(() => {
      result.current.handleSelectedDbChange('2')
    })

    rerender({ connectionName: 'Local', activeDb: 9, isActive: false })

    expect(result.current.selectedDb).toBe('2')
  })

  it('submits db form when selecting another database', () => {
    const { result } = renderHook(() =>
      useConnectionCardState({
        connectionName: 'Local',
        activeDb: 0,
        isActive: true
      })
    )

    const form = document.createElement('form')
    const submitSpy = vi.spyOn(form, 'requestSubmit')

    act(() => {
      result.current.dbFormRef.current = form
      result.current.handleSelectedDbChange('5')
    })

    expect(result.current.selectedDb).toBe('5')
    expect(submitSpy).toHaveBeenCalledTimes(1)
  })
})
