'use client'
import {
  createBrainstorm,
  createBrainstormResources,
  revalidateBrainstorms,
} from '@/features/brainstorm/brainstorm.actions'
import type {
  CreateBrainstormFormValues,
  CreateBrainstormResourceFile,
} from '@/features/brainstorm/brainstorm.types'
import { BrainstormCreateResourceList } from '@/features/brainstorm/components/brainstorm-create/BrainstormCreateResourceList'
import { useFileUpload } from '@/features/file-upload/file-upload.hooks'
import { useNavigationModalContext } from '@/features/general/components/NavigationModal'
import { useRouter } from '@/features/i18n/routing'
import { useTagSearch } from '@/features/tag/tag.hook'
import { useForm } from '@formsignals/form-react'
import {
  type ZodAdapter,
  configureZodAdapter,
} from '@formsignals/validation-adapter-zod'
import { useSignal, useSignals } from '@preact/signals-react/runtime'
import type { BrainstormResourceInsert } from '@repo/database/schema'
import { FieldError } from '@repo/design-system/components/FormErrors'
import {
  WysiwygEditorForm,
  getStringContentFromEditor,
} from '@repo/design-system/components/WysiwygEditor'
import { AutoCompleteTagInputForm } from '@repo/design-system/components/custom/auto-complete-tag-input'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { BadgeInfoIcon, CloudUploadIcon, Loader2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'

type BrainstormCreateFormProps = {
  popoverContainerId?: string
}

export function BrainstormCreateForm({
  popoverContainerId,
}: BrainstormCreateFormProps) {
  useSignals()
  const translateValidation = useTranslations('validation')
  const translate = useTranslations('brainstorm')

  const navigationModal = useNavigationModalContext()

  const router = useRouter()

  const [progressState, uploadFile, resetFileProgress] = useFileUpload()
  const { data, isLoading, searchInput, setSearchInput } = useTagSearch()

  const descriptionTextValue = useSignal('')

  const form = useForm<CreateBrainstormFormValues, typeof ZodAdapter>({
    validatorAdapter: configureZodAdapter({ takeFirstError: true }),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      resources: [],
    },
    onSubmit: async ({ resources, ...values }) => {
      const brainstormId = await createBrainstorm(
        values,
        descriptionTextValue.peek(),
      )

      const fileIds = await Promise.all(
        resources
          .filter(
            (resource): resource is CreateBrainstormResourceFile =>
              resource.type === 'file' && !!resource.fileValue[0],
          )
          .map(async (resource) => {
            const fileId = await uploadFile(
              `brainstorm/${brainstormId}`,
              resource.label,
              resource.fileValue[0],
            )
            return [resource.label, fileId] as const
          }),
      )

      const insertResources = resources
        .map((resources): BrainstormResourceInsert | null => {
          if (resources.type === 'link') {
            return {
              brainstormId,
              type: resources.type,
              label: resources.label,
              value: resources.value.startsWith('http')
                ? resources.value
                : `https://${resources.value}`,
            }
          }
          const fileId = fileIds.find(
            ([label]) => label === resources.label,
          )?.[1]
          if (!fileId) {
            console.error(
              `File id not found for resource label: ${resources.label}`,
            )
            return null
          }
          return {
            brainstormId,
            type: resources.type,
            label: resources.label,
            fileValue: fileId,
          }
        })
        .filter((e) => !!e)
      await createBrainstormResources(insertResources)

      await revalidateBrainstorms()
      resetFileProgress()
      setTimeout(() => router.replace(`/brainstorm/${brainstormId}`), 0)
    },
  })

  return (
    <form.FormProvider>
      <div id="popoverref" />
      <form
        className="flex flex-col gap-2 pb-2"
        onSubmit={async (e) => {
          e.stopPropagation()
          e.preventDefault()
          await form.handleSubmit()
        }}
      >
        <form.FieldProvider
          name="title"
          validator={z.string().min(1, translateValidation('required'))}
        >
          <div>
            <Label>{translate('createForm.labelTitle')}</Label>
            <InputForm placeholder={translate('createForm.placeholderTitle')} />
            <FieldError />
          </div>
        </form.FieldProvider>
        <form.FieldProvider
          name="tags"
          validator={z
            .array(
              z.object({
                label: z.string(),
                value: z.string(),
              }),
            )
            .min(1, translateValidation('required'))}
        >
          <div>
            <Label>{translate('createForm.labelTags')}</Label>
            <AutoCompleteTagInputForm
              containerId="popoverref"
              onOpenChange={(open) => {
                if (!navigationModal) return
                navigationModal.setBlockBackNavigation(open)
              }}
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
              data={data ?? []}
              isLoading={isLoading}
              placeholder={translate('createForm.placeholderTags')}
              emptyMessage={translate('createForm.emptyTags')}
              loadingMessage={translate('createForm.loadingTags')}
              enableCommaSeparation
              clearAfterSelect
            />
            <FieldError />
          </div>
        </form.FieldProvider>
        <form.FieldProvider name="description">
          <div>
            <Label>{translate('createForm.labelDescription')}</Label>
            <WysiwygEditorForm
              className="min-h-48"
              placeholder={translate('createForm.placeholderDescription')}
              onChange={(_, editor) => {
                editor.read(() => {
                  descriptionTextValue.value =
                    getStringContentFromEditor(editor)
                })
              }}
            />
            <FieldError />
          </div>
        </form.FieldProvider>
        <form.FieldProvider name="resources">
          <div>
            <p className="mb-1 font-semibold">
              {translate('headingResources')}
            </p>
            <BrainstormCreateResourceList
              uploadProgress={progressState}
              popoverContainerId={popoverContainerId}
              onPopoverOpenChange={(open) => {
                if (!navigationModal) return
                navigationModal.setBlockBackNavigation(open)
              }}
            />
          </div>
        </form.FieldProvider>

        <p className="mt-2 flex flex-row items-center gap-2 rounded border-primary border-l-4 bg-primary/20 p-2 text-foreground text-sm">
          <BadgeInfoIcon className="size-4" />
          {translate('createForm.whiteboardNotice')}
        </p>

        <Button className="mt-4" type="submit" disabled={!form.canSubmit.value}>
          {form.isSubmitting.value ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CloudUploadIcon className="mr-2 h-4 w-4" />
          )}
          {translate('createForm.publishButton')}
        </Button>
      </form>
    </form.FormProvider>
  )
}
