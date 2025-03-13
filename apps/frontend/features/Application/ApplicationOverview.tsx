import { Button } from '@repo/design-system/components/ui/button'
import {
  EyeIcon,
  MailsIcon,
  PaperclipIcon,
  PinIcon,
  StarIcon,
  TextIcon,
} from 'lucide-react'
import Image from 'next/image'

import { getApplicationsForProject } from '@/features/Application/applications.queries'
import { getLocale, getTranslations } from 'next-intl/server'
import { getProjectItem } from '@/features/projects/projects.queries'
import { ApplicationList } from '@/features/Application/ApplicationList'

type ApplicationDetailProps = {
  projectId: string
}

export default async function ApplicationOverview({
  projectId,
}: ApplicationDetailProps) {
  const [locale, translate, project, applications] = await Promise.all([
    getLocale(),
    getTranslations(),
    getProjectItem(projectId),
    getApplicationsForProject(projectId),
  ])

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="container mx-auto max-w-screen-lg px-4">
      <div className="mb-16 font-bold text-xl">
        Project Overview - {project.name}
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
            {applications.length} Applications
          </div>
        </div>
        <div className="flex w-1/3 flex-col items-center">
          <StarIcon className="mb-8 h-12 w-12 text-primary lg:h-24 lg:w-24" />
          <div className="text-center font-bold text-md lg:text-lg">
            1045 Likes
          </div>
        </div>
      </div>

      <ApplicationList projectId={projectId} />

      <div className="flex w-full flex-col">
        {applications.map((app, index) => (
          <div
            key={index}
            className="flex w-full flex-row gap-2 border-t-2 border-b-2 px-2 py-4"
          >
            <div className="w-2/12">
              <Image
                className="h-12 w-12 rounded-full object-cover lg:h-24 lg:w-24"
                src="/images/image-placeholder.jpg"
                alt={'Profile Image'}
                width="100"
                height="100"
              />
            </div>

            <div className="flex w-9/12 flex-col">
              <div className="text-sm">Application for this project</div>
              <div className="mb-2 font-bold text-lg">
                {app.firstName} {app.lastName}
              </div>
              <div className="text-sm">{app.message}</div>
            </div>

            <div className="flex w-1/12 flex-col gap-2 lg:flex-row">
              {app.file && (
                <a
                  href={`/uploads/${app.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PaperclipIcon />
                </a>
              )}
              <Button variant="ghost" className="w-full p-0">
                <PinIcon size={24} />
              </Button>
              <Button variant="ghost" className="w-full p-0">
                <MailsIcon size={24} />
              </Button>
            </div>
          </div>
        ))}

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
