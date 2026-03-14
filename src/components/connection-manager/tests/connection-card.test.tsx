import { describe, expect, it, rs } from '@rstest/core'
import { fireEvent, render, screen } from '@testing-library/react'

import { ConnectionCard } from '@/components/connection-manager/connection-card'

type ConnectionSettingsModalProps = {
  isOpen: boolean
}

rs.mock('@/components/connection-manager/connection-settings-modal', () => ({
  ConnectionSettingsModal: ({ isOpen }: ConnectionSettingsModalProps) => <div data-testid="settings-modal" data-open={String(isOpen)} />
}))

describe('ConnectionCard', () => {
  const connection = {
    id: 'conn-1',
    name: 'Local',
    url: 'redis://localhost:6379',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastTestStatus: 'ok' as const,
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
        setActiveAction={rs.fn()}
        setDatabaseAction={rs.fn()}
        renameAction={rs.fn()}
        testAction={rs.fn()}
        deleteAction={rs.fn()}
        openBrowserAction={rs.fn()}
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
