import ImageCarousel from '@/features/projects/components/ImageCarousel'
import { ProjectIssuesList } from '@/features/projects/components/ProjectIssuesList'
import { ProjectTimetable } from '@/features/projects/components/ProjectTimetable'
import ProjectTitle from '@/features/projects/components/ProjectTitle'
import { Resources } from '@/features/projects/components/Resources'
import { SkillScale } from '@/features/projects/components/SkillScale'
import TeamMembers from '@/features/projects/components/TeamMembers'
import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { useFormContext } from '@formsignals/form-react'
import { useSignals } from '@preact/signals-react/runtime'
import { Weekdays } from '@repo/database/schema'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'

export function CreateProjectPreview() {
  useSignals()
  const form = useFormContext<CreateProjectFormValues>()
  const formValues = form.json.value

  const timetabledata: { description: string; weekdays: string }[] = [
    { description: formValues.ttMon, weekdays: Weekdays.monday },
    { description: formValues.ttTue, weekdays: Weekdays.tuesday },
    { description: formValues.ttWed, weekdays: Weekdays.wednesday },
    { description: formValues.ttThu, weekdays: Weekdays.thursday },
    { description: formValues.ttFri, weekdays: Weekdays.friday },
    { description: formValues.ttSat, weekdays: Weekdays.saturday },
    { description: formValues.ttSun, weekdays: Weekdays.sunday },
  ]

  const timetable =
    formValues.timetableOutput === 'noTable'
      ? []
      : formValues.timetableCustom ||
        timetabledata
          .map((entry) => {
            if (entry.description !== '') return entry
          })
          .filter((entry) => entry !== undefined)
  return (
    <div className="inline-flex flex-col items-start justify-start gap-8 self-stretch">
      <ProjectTitle title={formValues.name} subtitle={formValues.phase} />
      <div>
        <div className="relative mb-16 flex flex-col gap-8 lg:flex-row">
          <ImageCarousel />
          <SkillScale projectSkills={formValues.skills} />
        </div>

        <div className="relative mb-16 flex w-full flex-col gap-8">
          {formValues.description && (
            <WysiwygRenderer value={formValues.description} />
          )}
        </div>

        <div className="relative mb-16 flex flex-col gap-8 lg:flex-row">
          <div className="relative inline-flex w-full flex-col justify-start gap-2 lg:w-1/2">
            <TeamMembers />
          </div>
          <div className="relative inline-flex w-full flex-col items-start justify-start gap-2 lg:w-1/2">
            {!!timetable.length && <ProjectTimetable timetable={timetable} />}
          </div>
        </div>

        <div className="relative mb-16 flex flex-col gap-8 lg:flex-row">
          <div className="relative inline-flex w-full flex-col justify-start lg:w-1/2">
            <ProjectIssuesList listOfIssues={formValues.issues} />
          </div>
          <div className="relative inline-flex w-full flex-col justify-start lg:w-1/2">
            <Resources resources={formValues.resources} />

            <p>{formValues.address}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
