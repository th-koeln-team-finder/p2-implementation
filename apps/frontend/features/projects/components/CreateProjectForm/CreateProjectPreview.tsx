import ImageCarousel from '@/features/projects/components/ImageCarousel'
import { ProjectIssuesList } from '@/features/projects/components/ProjectIssuesList'
import { ProjectResourcePreview } from '@/features/projects/components/ProjectResourcePreview'
import { ProjectTimetable } from '@/features/projects/components/ProjectTimetable'
import ProjectTitle from '@/features/projects/components/ProjectTitle'
import TeamMembers from '@/features/projects/components/TeamMembers'
import {CarouselItem} from '@/features/projects/components/TeamMembers'
import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { SkillScale } from '@/features/skills/components/SkillScale'
import { useFormContext } from '@formsignals/form-react'
import { useSignals } from '@preact/signals-react/runtime'
import {participants, UserSelect, Weekdays} from '@repo/database/schema'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import { useTranslations } from 'next-intl'
import {authMiddleware} from "@/auth";
import {getUserProfile} from "@/features/projects/projects.actions";
import {useEffect, useState} from "react";


export function CreateProjectPreview() {
  useSignals()
  const t = useTranslations('projects')
  const form = useFormContext<CreateProjectFormValues>()
  const formValues = form.json.value
  const [sessionUser, setUser] = useState<UserSelect>();

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
    setUser(await getUserProfile());
    };
    fetchUserProfile();
  }, []);


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

      <div className="grid grid-cols-2 gap-8">
        <ImageCarousel />
        <SkillScale
          skills={formValues.skills}
          title={t('skillScale.skillTitle')}
        />

        <div className="col-span-2">
          {formValues.description && (
            <WysiwygRenderer value={formValues.description} />
          )}
        </div>

        <TeamMembers participants={ sessionUser?[{users:sessionUser!!}]:[]} />

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
