'use client'

import { useFileUpload } from '@/features/file-upload/file-upload.hooks'
import { useRouter } from '@/features/i18n/routing'
import { useSignals } from '@preact/signals-react/runtime'
import { Button } from '@repo/design-system/components/ui/button'
import {
  EyeIcon,
  MailsIcon,
  PaperclipIcon,
  PinIcon,
  StarIcon,
  TextIcon,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

type ApplicationDetailProps = {
  projectId: string
}

export default function ApplicationOverview({
  projectId,
}: ApplicationDetailProps) {
  useSignals()

  const { data: session } = useSession()

  const _router = useRouter()

  const t = useTranslations('projects.apply')

  const [_progressState, _uploadFile, _resetFileProgress] = useFileUpload()

  const [_checkboxValue, _setCheckboxValue] = useState(false)

  return (
    <div className="container mx-auto max-w-screen-lg px-4">
      <div className="mb-16 font-bold text-xl">
        Project Overview - Tree Project
      </div>

      <div className="mb-16 flex w-full flex-row gap-4">
        <div className="flex w-1/3 flex-col items-center">
          <EyeIcon className="mb-8 h-12 w-12 text-primary lg:h-24 lg:w-24" />
          <div className="text-center font-bold text-md lg:text-lg">
            182 Impressions
          </div>
        </div>
        <div className="flex w-1/3 flex-col items-center">
          <TextIcon className="mb-8 h-12 w-12 text-primary lg:h-24 lg:w-24" />
          <div className="text-center font-bold text-md lg:text-lg">
            21 Applications
          </div>
        </div>
        <div className="flex w-1/3 flex-col items-center">
          <StarIcon className="mb-8 h-12 w-12 text-primary lg:h-24 lg:w-24" />
          <div className="text-center font-bold text-md lg:text-lg">
            1045 Likes
          </div>
        </div>
      </div>

      <div className="mb-8 font-bold text-xl">Applications (21)</div>

      <div className="flex w-full flex-col">
        <div className="flex w-full flex-row gap-2 border-t-2 border-b-2 px-2 py-4">
          <div className="w-2/12">
            <Image
              className="h-12 w-12 rounded-full object-cover lg:h-24 lg:w-24"
              src="/images/image-placeholder.jpg"
              alt={'Project Image'}
              width="100"
              height="100"
            />
          </div>

          <div className="flex w-9/12 flex-col">
            <div className="text-sm">Application as a designer</div>
            <div className="mb-2 font-bold text-lg">John Doe</div>
            <div className="text-sm">
              Text This is where to place a short description This is where to
              place a short description This is where to place a short
              description This is where to place a short description This is
              where to pla...
            </div>
          </div>

          <div className="flex w-1/12 flex-col gap-2 lg:flex-row">
            <div
              className={
                'inline-flex h-9 items-center p-0 [&_svg]:size-4 [&_svg]:shrink-0'
              }
            >
              <PaperclipIcon />
            </div>
            <Button variant="ghost" className="w-full p-0">
              <PinIcon size={24} />
            </Button>
            <Button variant="ghost" className="w-full p-0">
              <MailsIcon size={24} />
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-row gap-2 border-t-2 border-b-2 px-2 py-4">
          <div className="w-2/12">
            <Image
              className="h-12 w-12 rounded-full object-cover lg:h-24 lg:w-24"
              src="/images/image-placeholder.jpg"
              alt={'Project Image'}
              width="100"
              height="100"
            />
          </div>

          <div className="flex w-9/12 flex-col">
            <div className="text-sm">Application as a designer</div>
            <div className="mb-2 font-bold text-lg">John Doe</div>
            <div className="text-sm">
              Text This is where to place a short description This is where to
              place a short description This is where to place a short
              description This is where to place a short description This is
              where to pla...
            </div>
          </div>

          <div className="flex w-1/12 flex-col gap-2 lg:flex-row">
            <div
              className={
                'inline-flex h-9 items-center p-0 [&_svg]:size-4 [&_svg]:shrink-0'
              }
            >
              <PaperclipIcon />
            </div>
            <Button variant="ghost" className="w-full p-0">
              <PinIcon size={24} />
            </Button>
            <Button variant="ghost" className="w-full p-0">
              <MailsIcon size={24} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
