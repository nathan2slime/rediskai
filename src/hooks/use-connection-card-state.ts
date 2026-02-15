import { useCallback, useEffect, useRef, useState } from 'react'

type UseConnectionCardStateParams = {
  connectionName: string
  activeDb: number
  isActive: boolean
}

export const useConnectionCardState = ({ connectionName, activeDb, isActive }: UseConnectionCardStateParams) => {
  const [name, setName] = useState(connectionName)
  const [selectedDb, setSelectedDb] = useState(String(activeDb))
  const dbFormRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setName(connectionName)
  }, [connectionName])

  useEffect(() => {
    if (isActive) {
      setSelectedDb(String(activeDb))
    }
  }, [activeDb, isActive])

  const handleSelectedDbChange = useCallback((value: string) => {
    setSelectedDb(value)
    dbFormRef.current?.requestSubmit()
  }, [])

  return {
    name,
    setName,
    selectedDb,
    dbFormRef,
    handleSelectedDbChange
  }
}
