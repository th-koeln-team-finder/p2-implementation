import {
  FilterKeys,
  FilterParseFunctions,
  type Skill,
} from '@/features/projects/components/FilterBar/filterbar.constants'
import { format } from 'date-fns'
import { useQueryStates } from 'nuqs'

export function useFilterBarQueryParams() {
  return useQueryStates({
    [FilterKeys.minTeamSize]: {
      parse: FilterParseFunctions.number,
    },
    [FilterKeys.maxTeamSize]: {
      parse: FilterParseFunctions.number,
    },
    [FilterKeys.minStars]: {
      parse: FilterParseFunctions.number,
    },
    [FilterKeys.minCreationDate]: {
      parse: FilterParseFunctions.date(true),
      serialize: (v) => (v ? format(v, 'dd.MM.y') : ''),
    },
    [FilterKeys.maxCreationDate]: {
      parse: FilterParseFunctions.date(false),
      serialize: (v) => (v ? format(v, 'dd.MM.y') : ''),
    },
    [FilterKeys.skillRequirements]: {
      parse: FilterParseFunctions.skillRequirements,
      serialize: (v: Skill[]) => {
        if (!v) return ''
        return v
          .map(
            (skill) =>
              `${encodeURI(skill.value)}:${encodeURIComponent(skill.label)}:${skill.level}`,
          )
          .join(',')
      },
    },
  })
}
