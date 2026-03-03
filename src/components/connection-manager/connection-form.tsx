'use client'

import { ChevronLeft, FloppyDisk } from '@gravity-ui/icons'
import { Button, Icon, TextInput } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import type { ConnectionFormProps } from '@/types/connection-manager'

const connectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  url: z.string().url().trim().min(1, 'URL is required')
})

type ConnectionFormValues = z.infer<typeof connectionSchema>

/**
 * Form used to add a new connection.
 * @example
 * <ConnectionForm addAction={action} addPending={false} />
 */
export const ConnectionForm = ({ addAction, closeAction, addPending, addState }: ConnectionFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      url: ''
    }
  })
  const [isTransitionPending, startTransition] = useTransition()
  const submittedRef = useRef(false)

  const handleAdd = handleSubmit(async values => {
    const formData = new FormData()
    formData.set('name', values.name)
    formData.set('url', values.url)

    submittedRef.current = true
    startTransition(() => {
      addAction(formData)
      closeAction()
    })
  })

  useEffect(() => {
    if (!submittedRef.current) return
    if (addPending || isTransitionPending) return
    if (addState.ok) {
      reset()
    }
    submittedRef.current = false
  }, [addPending, addState.ok, isTransitionPending, reset])

  const isBusy = addPending || isSubmitting || isTransitionPending

  return (
    <div className="space-y-4 w-full">
      <form className="flex flex-col space-y-2 w-full justify-between items-end" onSubmit={handleAdd}>
        <div className="space-y-1 w-full flex gap-2">
          <Controller
            control={control}
            name="name"
            render={({ field }) => {
              const { ref, onChange, ...inputField } = field

              return (
                <TextInput
                  label="Name"
                  {...inputField}
                  placeholder="Connection name"
                  error={Boolean(errors.name?.message)}
                  errorMessage={errors.name?.message}
                  validationState={errors.name?.message ? 'invalid' : undefined}
                  controlRef={ref}
                  onUpdate={onChange}
                />
              )
            }}
          />
          <Controller
            control={control}
            name="url"
            render={({ field }) => {
              const { ref, onChange, ...inputField } = field

              return (
                <TextInput
                  label="URL"
                  {...inputField}
                  placeholder="redis://localhost:6379"
                  error={Boolean(errors.url?.message)}
                  errorMessage={errors.url?.message}
                  validationState={errors.url?.message ? 'invalid' : undefined}
                  controlRef={ref}
                  onUpdate={onChange}
                />
              )
            }}
          />
        </div>

        <div className="w-full justify-end items-end gap-2 flex">
          <Button onClick={closeAction}>
            <Icon data={ChevronLeft} size={15} />
            Back
          </Button>

          <Button loading={isBusy} type="submit" view="action" size="m">
            <Icon data={FloppyDisk} size={15} />
            Confirm
          </Button>
        </div>
      </form>
    </div>
  )
}
