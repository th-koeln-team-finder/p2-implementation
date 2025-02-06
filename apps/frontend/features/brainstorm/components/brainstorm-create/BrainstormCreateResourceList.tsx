import type { CreateBrainstormFormValues } from '@/features/brainstorm/brainstorm.types'
import { BrainstormCreateResourceListEntry } from '@/features/brainstorm/components/brainstorm-create/BrainstormCreateResourceListEntry'
import { useFieldContext } from '@formsignals/form-react'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import { Button } from '@repo/design-system/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

type BrainstormCreateResourceListProps = {
  uploadProgress?: Record<string, number>
  popoverContainerId?: string
  onPopoverOpenChange?: (isOpen: boolean) => void
}

export function BrainstormCreateResourceList({
  uploadProgress,
  popoverContainerId,
  onPopoverOpenChange,
}: BrainstormCreateResourceListProps) {
  useSignals()
  const translate = useTranslations('brainstorm')
  const field = useFieldContext<CreateBrainstormFormValues['resources'], ''>()

  return (
    <div className="flex flex-col gap-2">
      {field.data.value.map((resource, index) => (
        <field.SubFieldProvider name={`${index}`} key={resource.key}>
          <BrainstormCreateResourceListEntry
            uploadProgress={uploadProgress}
            popoverContainerId={popoverContainerId}
            onPopoverOpenChange={onPopoverOpenChange}
          />
        </field.SubFieldProvider>
      ))}

      <FieldError />

      <Button
        className="w-fit"
        variant="outline"
        type="button"
        onClick={() => {
          field.pushValueToArray({
            type: 'link',
            label: '',
            value: '',
          })
        }}
      >
        <PlusIcon />
        {translate('createForm.addResourceButton')}
      </Button>
    </div>
  )
}
