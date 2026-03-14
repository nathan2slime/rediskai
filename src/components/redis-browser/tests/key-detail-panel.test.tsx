import { beforeEach, describe, expect, it, rs } from '@rstest/core'
import { render, screen } from '@testing-library/react'
import * as React from 'react'

import { KeyDetailPanel } from '@/components/redis-browser/key-detail-panel'

const useActionStateMock = rs.fn()

rs.mock('@/hooks/use-key-detail-state', () => ({
  useKeyDetailState: () => ({
    copied: false,
    draftValue: '',
    draftTtl: '',
    canEditString: false,
    setDraftValue: rs.fn(),
    setDraftTtl: rs.fn(),
    handleCopy: rs.fn(),
    handleDelete: rs.fn(),
    handleRetry: rs.fn()
  })
}))

describe('KeyDetailPanel', () => {
  beforeEach(() => {
    useActionStateMock.mockReset()
    rs.spyOn(React, 'useActionState').mockImplementation((...args: any[]) => useActionStateMock(...args))
  })

  it('shows empty state when no key selected', () => {
    useActionStateMock
      .mockReturnValueOnce([{ ok: false, key: '', error: 'Select a key' }, rs.fn(), false])
      .mockReturnValueOnce([{ ok: true, key: '' }, rs.fn(), false])
      .mockReturnValueOnce([{ ok: true, key: '' }, rs.fn(), false])

    render(<KeyDetailPanel selectedKey={null} />)

    expect(screen.getByText(/no key selected/i)).toBeInTheDocument()
  })

  it('shows error state when detail fails', () => {
    useActionStateMock
      .mockReturnValueOnce([{ ok: false, key: '', error: 'Failed to load' }, rs.fn(), false])
      .mockReturnValueOnce([{ ok: true, key: '' }, rs.fn(), false])
      .mockReturnValueOnce([{ ok: true, key: '' }, rs.fn(), false])

    render(<KeyDetailPanel selectedKey="key:1" />)

    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })
})
