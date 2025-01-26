'use client'

import { type ProjectTimetableSelect, Weekdays } from '@repo/database/schema'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export function ProjectTimetable({
  timetable,
}: {
  timetable:
    | ProjectTimetableSelect[]
    | { description: string; weekdays: string }[]
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
      <div className="w-full">
          <div className="self-stretch font-medium text-2xl leading-loose">
              {translate('createProjects.timetable.title')}
          </div>
          {/* Mobile Layout */}
          <div className="lg:hidden">
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
                          <div
                              className="flex w-3/12 items-center justify-center border-border border-r bg-muted p-4 font-medium text-muted-foreground">
                              {header}
                          </div>
                          {/* Times (Content Column) */}
                          <div
                              className="flex w-9/12 items-center justify-center p-4 text-muted-foreground first:rounded-tr-md last:rounded-br-md">
                              {timetableEntry?.description || '-'}
                          </div>
                      </div>
                  )
              })}
          </div>

          {/* Desktop Layout */}
          <table className="hidden w-full border-separate border-spacing-0 lg:table">
              <thead>
              <tr>
                  {tableHeader.map((header) => (
                      <th
                          key={header}
                          className="border-border border-y border-r bg-muted first:rounded-tl-md first:border-l last:rounded-tr-md"
                      >
                          <p className="p-4 font-normal text-muted-foreground">
                              {header}
                          </p>
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
                      if (!timetableEntry || timetableEntry.description === '')
                          return (
                              <td
                                  key={weekday}
                                  className="border-border border-r border-b p-2 text-center first:rounded-bl-md first:border-l last:rounded-br-md"
                                  valign="top"
                              >
                                  -
                              </td>
                          )
                      return (
                          <td
                              key={weekday}
                              className="border-border border-r border-b p-2 first:rounded-bl-md first:border-l last:rounded-br-md"
                              valign="top"
                          >
                              {timetableEntry.description}
                          </td>
                      )
                  })}
              </tr>
              </tbody>
          </table>
      </div>
  )
}
