import { act, renderHook } from '@testing-library/react'

import { useThemeToggle } from '@/hooks/use-theme-toggle'

const setTheme = vi.fn()
const useThemeMock = vi.fn()

vi.mock('next-themes', () => ({
  useTheme: () => useThemeMock()
}))

describe('useThemeToggle', () => {
  beforeEach(() => {
    setTheme.mockClear()
    useThemeMock.mockReturnValue({
      theme: 'light',
      setTheme
    })
  })

  it('starts unmounted and toggles from light to dark', () => {
    const { result } = renderHook(() => useThemeToggle())

    expect(result.current.mounted).toBe(true)
    expect(result.current.isDark).toBe(false)

    act(() => {
      result.current.toggleTheme()
    })

    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it('toggles from dark to light', () => {
    useThemeMock.mockReturnValue({
      theme: 'dark',
      setTheme
    })

    const { result } = renderHook(() => useThemeToggle())

    expect(result.current.isDark).toBe(true)

    act(() => {
      result.current.toggleTheme()
    })

    expect(setTheme).toHaveBeenCalledWith('light')
  })
})
