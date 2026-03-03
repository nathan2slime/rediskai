import { fireEvent, render, screen } from '@testing-library/react'

import { ConnectionCard } from '@/components/connection-manager/connection-card'

vi.mock('@/components/connection-manager/connection-settings-modal', () => ({
  ConnectionSettingsModal: ({ isOpen }: { isOpen: boolean }) => <div data-testid="settings-modal" data-open={String(isOpen)} />
}))

describe('ConnectionCard', () => {
  const connection = {
    id: 'conn-1',
    name: 'Local',
    url: 'redis://localhost:6379',
    lastTestStatus: 'ok',
    lastTestedAt: '2024-01-01T00:00:00.000Z',
    lastTestLatencyMs: 12,
    lastTestError: undefined
  }

  it('shows active label and opens settings modal', () => {
    render(
      <ConnectionCard
        connection={connection}
        isActive
        testPending={false}
        setActiveAction={vi.fn()}
        setDatabaseAction={vi.fn()}
        renameAction={vi.fn()}
        testAction={vi.fn()}
        deleteAction={vi.fn()}
        openBrowserAction={vi.fn()}
        activeDb={0}
      />
    )

    expect(screen.getByText('active', { exact: true })).toBeInTheDocument()

    expect(screen.getByTestId('settings-modal')).toHaveAttribute('data-open', 'false')

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[buttons.length - 1])

    expect(screen.getByTestId('settings-modal')).toHaveAttribute('data-open', 'true')
  })
})
