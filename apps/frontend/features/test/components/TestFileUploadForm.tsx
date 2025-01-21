'use client'
import { useFileUpload } from '@/features/file-upload/file-upload.hooks'
import { useForm } from '@formsignals/form-react'
import { useSignals } from '@preact/signals-react/runtime'
import {
  FileListForm,
  FilePreviewsForm,
  FileUploadForm,
} from '@repo/design-system/components/custom/file-upload'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { UploadIcon } from 'lucide-react'

export function TestFileUploadForm() {
  useSignals()
  const [progressState, uploadFile, resetFileProgress] = useFileUpload()

  const form = useForm({
    defaultValues: {
      bucketPrefix: 'test',
      file: [] as File[],
    },
    onSubmit: async (values) => {
      if (!values.file) {
        return
      }

      await Promise.all(
        values.file.map(async (file) => {
          await uploadFile(values.bucketPrefix, file.name, file)
        }),
      )
      setTimeout(() => {
        values.file.map((file) => {
          resetFileProgress(file.name)
        })
        form.reset()
      }, 1000)
    },
  })

  return (
    <form.FormProvider>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()
          await form.handleSubmit()
        }}
      >
        <form.FieldProvider name="bucketPrefix">
          <Label>Bucket Prefix</Label>
          <InputForm />
        </form.FieldProvider>
        <form.FieldProvider name="file">
          <Label>File</Label>
          <FileUploadForm
            accepts="image/*,application/pdf"
            multiple
            placeholder={<FilePreviewsForm progressState={progressState} />}
          />
          <FileListForm className="my-2" progressState={progressState} />
        </form.FieldProvider>
        <Button type="submit" disabled={!form.canSubmit.value}>
          <UploadIcon />
          Upload
        </Button>
      </form>
    </form.FormProvider>
  )
}
