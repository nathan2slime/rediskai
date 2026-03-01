'use client'

import { useEffect, useMemo, useState } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STORAGE_KEY = 'theme-preset'

const PRESETS = [
  { id: 'classic', label: 'Classic', className: '' },
  { id: 'ember', label: 'Ember', className: 'theme-ember' },
  { id: 'ocean', label: 'Ocean', className: 'theme-ocean' },
  { id: 'forest', label: 'Forest', className: 'theme-forest' }
]

const presetClassNames = PRESETS.map(preset => preset.className).filter(Boolean)

const applyPresetClass = (className: string) => {
  const root = document.documentElement
  for (const presetClass of presetClassNames) {
    root.classList.remove(presetClass)
  }
  if (className) {
    root.classList.add(className)
  }
}

export const ThemePresets = () => {
  const [mounted, setMounted] = useState(false)
  const [value, setValue] = useState('classic')

  useEffect(() => {
    setMounted(true)
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && PRESETS.some(preset => preset.id === stored)) {
      setValue(stored)
      const preset = PRESETS.find(item => item.id === stored)
      applyPresetClass(preset?.className ?? '')
    }
  }, [])

  const handleChange = (nextValue: string) => {
    setValue(nextValue)
    const preset = PRESETS.find(item => item.id === nextValue)
    applyPresetClass(preset?.className ?? '')
    window.localStorage.setItem(STORAGE_KEY, nextValue)
  }

  const label = useMemo(() => {
    const preset = PRESETS.find(item => item.id === value)
    return preset?.label ?? 'Classic'
  }, [value])

  if (!mounted) return null

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger size="sm" className="w-[140px]">
        <SelectValue>{label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {PRESETS.map(preset => (
          <SelectItem key={preset.id} value={preset.id}>
            {preset.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
