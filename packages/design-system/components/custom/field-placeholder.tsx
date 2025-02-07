import { UploadIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function FieldPlaceholder() {
  const translate = useTranslations('components.fileUpload')
  return (
    <div className="flex flex-row items-center gap-2">
      <UploadIcon className="h-6 w-6" />
      <span>{translate('placeholderText')}</span>
    </div>
  )
}
