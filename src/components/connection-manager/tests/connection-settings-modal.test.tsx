import { describe, expect, it, rs } from '@rstest/core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ConnectionSettingsModal } from '@/components/connection-manager/connection-settings-modal'
import { ThemeProvider } from '@/components/theme/theme-provider'

describe('ConnectionSettingsModal', () => {
  it('enables save only when name is valid and submits', async () => {
    const renameAction = rs.fn()
    const deleteAction = rs.fn()
    const onNameChange = rs.fn()

    render(
      <ThemeProvider>
        <ConnectionSettingsModal
          isOpen
          onOpenChange={rs.fn()}
          connectionId="conn-1"
          name="Local"
          onNameChange={onNameChange}
          renameAction={renameAction}
          deleteAction={deleteAction}
        />
      </ThemeProvider>
    )

    const nameInput = screen.getByDisplayValue('Local')
    const saveButton = screen.getByRole('button', { name: /save/i })

    fireEvent.change(nameInput, { target: { value: '' } })
    expect(saveButton).toBeDisabled()

    fireEvent.change(nameInput, { target: { value: 'New Name' } })
    await waitFor(() => expect(saveButton).not.toBeDisabled())

    fireEvent.click(saveButton)
    await waitFor(() => expect(renameAction).toHaveBeenCalledTimes(1))
  })
})
