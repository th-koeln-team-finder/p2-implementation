'use client'

import { type ProjectTimetableSelect, Weekdays } from '@repo/database/schema'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export function ProjectTimetable({
  timetable,
}: {
  timetable: ProjectTimetableSelect[]
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

  return (
    <table className="w-full border-separate border-spacing-0">
      <thead>
        <tr>
          {tableHeader.map((header) => (
            <th
              key={header}
              className="border-border border-y border-r bg-primary/10 first:rounded-tl-lg first:border-l last:rounded-tr-lg"
            >
              <p className="p-4 font-normal text-muted-foreground">{header}</p>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {Object.values(Weekdays).map((weekday) => {
            if (weekday === 'standalone') return
            const timetableEntry = timetable.find(
              (entry) => entry.weekdays === weekday,
            )
            if (!timetableEntry)
              return (
                <td
                  key={weekday}
                  className="border-border border-r border-b p-2 text-center first:rounded-bl-lg first:border-l last:rounded-br-lg"
                  valign="top"
                >
                  -
                </td>
              )
            return (
              <td
                key={weekday}
                className="border-border border-r border-b p-2 first:rounded-bl-lg first:border-l last:rounded-br-lg"
                valign="top"
              >
                {timetableEntry.description}
              </td>
            )
          })}
        </tr>
      </tbody>
    </table>
  )
}
