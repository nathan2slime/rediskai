import { render, screen } from '@testing-library/react'

import { KeyDetailPanel } from '@/components/redis-browser/key-detail-panel'

const useActionStateMock = vi.fn()

vi.mock('react', async () => {
  const actual = await vi.importActual<any>('react')
  return {
    ...actual,
    useActionState: (...args: any[]) => useActionStateMock(...args)
  }
})

vi.mock('@/hooks/use-key-detail-state', () => ({
  useKeyDetailState: () => ({
    copied: false,
    draftValue: '',
    draftTtl: '',
    canEditString: false,
    setDraftValue: vi.fn(),
    setDraftTtl: vi.fn(),
    handleCopy: vi.fn(),
    handleDelete: vi.fn(),
    handleRetry: vi.fn()
  })
}))

describe('KeyDetailPanel', () => {
  beforeEach(() => {
    useActionStateMock.mockReset()
  })

  it('shows empty state when no key selected', () => {
    useActionStateMock
      .mockReturnValueOnce([{ ok: false, key: '', error: 'Select a key' }, vi.fn(), false])
      .mockReturnValueOnce([{ ok: true, key: '' }, vi.fn(), false])
      .mockReturnValueOnce([{ ok: true, key: '' }, vi.fn(), false])

    render(<KeyDetailPanel selectedKey={null} />)

    expect(screen.getByText(/no key selected/i)).toBeInTheDocument()
  })

  it('shows error state when detail fails', () => {
    useActionStateMock
      .mockReturnValueOnce([{ ok: false, key: '', error: 'Failed to load' }, vi.fn(), false])
      .mockReturnValueOnce([{ ok: true, key: '' }, vi.fn(), false])
      .mockReturnValueOnce([{ ok: true, key: '' }, vi.fn(), false])

    render(<KeyDetailPanel selectedKey="key:1" />)

    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })
})
