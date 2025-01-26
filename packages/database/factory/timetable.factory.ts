import { faker } from '@faker-js/faker/locale/de'
import type { ProjectTimetableInsert } from '../schema'

export const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as ProjectTimetableInsert['weekdays'][]

export function makeTimetableElement(
  projectId: string,
  uniqueWeekdays: Set<string>,
): ProjectTimetableInsert | null {
  let tries = 0
  let selectedWeekday = faker.helpers.arrayElement(weekdays)

  while (uniqueWeekdays.has(`${projectId}-${selectedWeekday}`) && tries < 10) {
    selectedWeekday = faker.helpers.arrayElement(weekdays)
    tries++
  }
  if (tries >= 10) {
    return null
  }
  uniqueWeekdays.add(`${projectId}-${selectedWeekday}`)

  return {
    projectId,
    weekdays: selectedWeekday,
    description: faker.lorem.sentence(),
  }
}
