import { ProjectIssuesList } from '@/features/projects/components/ProjectIssuesList'
import { ProjectResourcePreview } from '@/features/projects/components/ProjectResourcePreview'
import { ProjectTimetable } from '@/features/projects/components/ProjectTimetable'
import ProjectTitle from '@/features/projects/components/ProjectTitle'
import TeamMembers from '@/features/projects/components/TeamMembers'
import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { SkillScale } from '@/features/skills/components/SkillScale'
import { useFormContext } from '@formsignals/form-react'
import { useSignals } from '@preact/signals-react/runtime'
import { type UserSelect, Weekdays } from '@repo/database/schema'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import { useTranslations } from 'next-intl'
import { getUserProfile } from '@/features/projects/projects.actions'
import { useEffect, useState } from 'react'
import { useSignalEffect } from '@preact/signals-react'
import CreateProjectPicturePreviewCarousel from '@/features/projects/components/CreateProjectForm/CreateProjectPicturePreviewCarousel'
import {BrainstormTagList} from "@/features/brainstorm/components/brainstorm-details/BrainstormTagList";

export function CreateProjectPreview({
  progressState,
}: { progressState: Record<string, number> }) {
  useSignals()
  const t = useTranslations('projects')
  const form = useFormContext<CreateProjectFormValues>()
  const formValues = form.json.value
  const [sessionUser, setUser] = useState<UserSelect>()

  const timetabledata: { description: string; weekdays: string }[] = [
    { description: formValues.ttMon, weekdays: Weekdays.monday },
    { description: formValues.ttTue, weekdays: Weekdays.tuesday },
    { description: formValues.ttWed, weekdays: Weekdays.wednesday },
    { description: formValues.ttThu, weekdays: Weekdays.thursday },
    { description: formValues.ttFri, weekdays: Weekdays.friday },
    { description: formValues.ttSat, weekdays: Weekdays.saturday },
    { description: formValues.ttSun, weekdays: Weekdays.sunday },
  ]

  useEffect(() => {
    const fetchUserProfile = async () => {
      setUser(await getUserProfile())
    }
    fetchUserProfile()
  }, [])

  const timetable =
    formValues.timetableOutput === 'noTable'
      ? []
      : formValues.timetableCustom ||
        timetabledata
          .map((entry) => {
            if (entry.description !== '') return entry
          })
          .filter((entry) => entry !== undefined)

  const [fieldPreviews, setFieldPreviews] = useState<string[]>([])
  useSignalEffect(() => {
    const fieldPreviews = form.data.value.pictures.value.map((file) => {
      return URL.createObjectURL(file.data.value)
    })
    setFieldPreviews(fieldPreviews)
    return () => {
      for (const [_, url] of fieldPreviews) {
        URL.revokeObjectURL(url)
      }
    }
  })
  console.log(formValues.tags+"tags")
  const tagList=formValues.tags.map(tag => ({
      tag: {
        id: tag.value, // oder eine geeignete ID, falls `value` nicht eindeutig ist
        name: tag.label
      }
    }))
  return (
    <div className="inline-flex flex-col items-start justify-start gap-4 self-stretch">
      <ProjectTitle title={formValues.name} subtitle={formValues.phase} />
  <div className='flex flex-col w-full pr-3'>
    <BrainstormTagList tags={tagList } />

  </div>
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        <CreateProjectPicturePreviewCarousel
          images={fieldPreviews}
          progressState={progressState}
        />
        <SkillScale
          title={t('skillScale.skillTitle')}
          emptySkillsMessage={t('skillScale.emptySkills')}
          skills={formValues.skills.map((skill) => ({
            label: skill.value.startsWith('new:')
              ? skill.value.replace('new:', '')
              : skill.label,
            level: skill.level,
          }))}
        />

        <div className="col-span-2">
          {formValues.description && (
            <WysiwygRenderer value={formValues.description} />
          )}
        </div>

        <TeamMembers
          participants={sessionUser ? [{ users: sessionUser }] : []}
        />

        {!!timetable.length && (
          <div className="relative inline-flex w-full flex-col items-start justify-start gap-2 lg:w-1/2">
            <ProjectTimetable timetable={timetable} />
          </div>
        )}

        {!!formValues.issues.length && (
          <ProjectIssuesList listOfIssues={formValues.issues} />
        )}
        {!!formValues.resources.length && (
          <div className="flex flex-col gap-1">
            <h2 className="mb-2 font-medium text-2xl">{t('links')}</h2>
            {formValues.resources.map((res, index) => (
              <ProjectResourcePreview
                key={`${res.label}-${index}`}
                resource={res}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
