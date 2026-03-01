import { useCallback, useState } from 'react'

import { testConnection } from '@/app/actions/connection-actions'
import type { ActionResult } from '@/types/connections'

type NotifyApi = {
  error: (message: string) => void
}

type UseConnectionTestActionParams = {
  notify: NotifyApi
}

const initialResult: ActionResult = { ok: true }

export const useConnectionTestAction = ({ notify }: UseConnectionTestActionParams) => {
  const [pendingTestId, setPendingTestId] = useState<string | null>(null)

  const handleTest = useCallback(
    async (id: string) => {
      setPendingTestId(id)
      const formData = new FormData()
      formData.set('id', id)
      const result = await testConnection(initialResult, formData)
      if (!result.ok) {
        notify.error('Connection is closed.')
      }
      setPendingTestId(null)
    },
    [notify]
  )

  return {
    pendingTestId,
    handleTest
  }
}
