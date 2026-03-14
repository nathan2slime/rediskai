import '@testing-library/jest-dom'
import { afterEach, rs } from '@rstest/core'
import { cleanup } from '@testing-library/react'
import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  view?: string
  size?: string
  loading?: boolean
  pin?: string
}

type IconProps = {
  data?: unknown
}

type TextProps = {
  as?: React.ElementType
  children?: React.ReactNode
}

type ModalProps = {
  open?: boolean
  children?: React.ReactNode
}

type SelectProps = {
  value?: string[]
  onUpdate?: (value: string[]) => void
  options?: { value: string; content: React.ReactNode }[]
}

afterEach(() => {
  cleanup()
})

rs.mock('@gravity-ui/uikit', () => {
  const Button = ({ children, loading, view, size, pin, ...props }: ButtonProps) => React.createElement('button', props, children)

  const Icon = ({ data, ...props }: IconProps) => React.createElement('span', { 'data-icon': true, ...props })

  const Text = ({ as: Tag = 'span', children, ...props }: TextProps) => React.createElement(Tag, props, children)

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

  const Modal = ({ open, children }: ModalProps) => (open ? React.createElement('div', null, children) : null)

  const Divider = (props: React.HTMLAttributes<HTMLHRElement>) => React.createElement('hr', props)

  const Label = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => React.createElement('span', props, children)

  const Select = ({ value, onUpdate, options = [], ...props }: SelectProps) =>
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
