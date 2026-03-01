import { useEffect, useState } from 'react'

type UseBrowserSelectionParams = {
  activeConnectionId: string | null
}

export const useBrowserSelection = ({ activeConnectionId }: UseBrowserSelectionParams) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  useEffect(() => {
    setSelectedKey(null)
  }, [activeConnectionId])

  return {
    selectedKey,
    setSelectedKey
  }
}
