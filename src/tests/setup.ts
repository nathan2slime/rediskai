import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

vi.mock('@gravity-ui/uikit', () => {
  const Button = ({
    children,
    loading,
    view,
    size,
    pin,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { view?: string; size?: string; loading?: boolean; pin?: string }) => React.createElement('button', props, children)

  const Icon = ({ data, ...props }: { data?: unknown }) => React.createElement('span', { 'data-icon': true, ...props })

  const Text = ({ as: Tag = 'span', children, ...props }: { as?: React.ElementType; children?: React.ReactNode }) => React.createElement(Tag, props, children)

  const TextInput = React.forwardRef<HTMLInputElement, any>(({ controlRef, onUpdate, onChange, error, errorMessage, validationState, ...props }, ref) =>
    React.createElement('input', {
      ...props,
      ref: controlRef ?? ref,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event)
        onUpdate?.(event.target.value)
      }
    })
  )
  TextInput.displayName = 'TextInput'

  const Card = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => React.createElement('div', props, children)

  const Modal = ({ open, children }: { open?: boolean; children?: React.ReactNode }) => (open ? React.createElement('div', null, children) : null)

  const Divider = (props: React.HTMLAttributes<HTMLHRElement>) => React.createElement('hr', props)

  const Label = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => React.createElement('span', props, children)

  const Select = ({
    value,
    onUpdate,
    options = [],
    ...props
  }: {
    value?: string[]
    onUpdate?: (value: string[]) => void
    options?: { value: string; content: React.ReactNode }[]
  }) =>
    React.createElement(
      'select',
      {
        ...props,
        value: value?.[0] ?? '',
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) => onUpdate?.([event.target.value])
      },
      options.map(option => React.createElement('option', { key: option.value, value: option.value }, option.content))
    )

  return { Button, Icon, Text, TextInput, Card, Modal, Divider, Label, Select }
})
