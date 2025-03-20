'use client'

import { type ProjectTimetableSelect, Weekdays } from '@repo/database/schema'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export function ProjectTimetable({
  timetable,
}: {
  timetable:
    | ProjectTimetableSelect[]
    | { description: string; weekdays: string }[]
    | string
}) {
  const translate = useTranslations()

  const tableHeader = useMemo(
    () => [
      translate('utils.weekdays.monday'),
      translate('utils.weekdays.tuesday'),
      translate('utils.weekdays.wednesday'),
      translate('utils.weekdays.thursday'),
      translate('utils.weekdays.friday'),
      translate('utils.weekdays.saturday'),
      translate('utils.weekdays.sunday'),
    ],
    [translate],
  )

  if (
    Array.isArray(timetable) &&
    timetable.length === 1 &&
    timetable[0].weekdays === 'standalone'
  ) {
    timetable = timetable[0].description
  }

  if (typeof timetable === 'string') {
    return (
      <div className="w-full">
        <div className="self-stretch font-medium text-2xl leading-loose">
          {translate('createProjects.timetable.title')}
        </div>
        <WysiwygRenderer value={timetable} />
      </div>
    )
  }
  return (
    <div className="w-full">
      <div className="self-stretch font-medium text-xl leading-loose">
        {translate('createProjects.timetable.title')}
      </div>

      {/* Mobile Layout */}
      <div className="">
        {Object.values(Weekdays).map((weekday, index) => {
          if (weekday === 'standalone') return null
          const header = tableHeader[index]
          const timetableEntry = timetable.find(
            (entry) => entry.weekdays === weekday,
          )

          return (
            <div
              key={weekday}
              className="flex border-border border-r border-b border-l first:rounded-tl-md first:rounded-tr-md first:border-t last:rounded-br-md last:rounded-bl-md"
            >
              {/* Weekday (Header Column) */}
              <div className="flex w-3/12 items-center justify-center border-border border-r bg-muted p-3 font-medium text-muted-foreground">
                {header}
              </div>
              {/* Times (Content Column) */}
              <div className="w-9/12 p-3 text-start first:rounded-tr-md last:rounded-br-md">
                {timetableEntry?.description || '-'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
