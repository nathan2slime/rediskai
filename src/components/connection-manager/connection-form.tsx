'use client'

import { Plus } from '@gravity-ui/icons'
import { Button, Icon, Text, TextInput } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import type { ConnectionFormProps } from '@/types/connection-manager'

const connectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  url: z.string().trim().min(1, 'URL is required')
})

type ConnectionFormValues = z.infer<typeof connectionSchema>

/**
 * Form used to add a new connection.
 * @example
 * <ConnectionForm addAction={action} addPending={false} />
 */
export const ConnectionForm = ({ addAction, addPending, addError }: ConnectionFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      name: '',
      url: ''
    }
  })

  const handleAdd = handleSubmit(async values => {
    const formData = new FormData()
    formData.set('name', values.name)
    formData.set('url', values.url)

    await addAction(formData)
    reset()
  })

  const isBusy = addPending || isSubmitting

  return (
    <div className="space-y-4">
      <form className="space-y-2" onSubmit={handleAdd}>
        <div className="space-y-1">
          <Controller
            control={control}
            name="name"
            render={({ field }) => {
              const { ref, onChange, ...inputField } = field

              return (
                <TextInput
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
          {addError ? (
            <Text className="text-xs" color="danger-heavy">
              {addError}
            </Text>
          ) : null}
        </div>
        <Button loading={isBusy} type="submit" view="action" size="m">
          Add
          <Icon data={Plus} size={15} />
        </Button>
      </form>
    </div>
  )
}
