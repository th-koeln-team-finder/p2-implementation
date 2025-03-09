import {
  FilterKeys,
  FilterParseFunctions,
  type FilterSearchParams,
} from '@/features/projects/components/FilterBar/filterbar.constants'

export function parseFilters(filters: FilterSearchParams) {
  return {
    [FilterKeys.minTeamSize]: FilterParseFunctions.number(
      filters[FilterKeys.minTeamSize],
    ),
    [FilterKeys.maxTeamSize]: FilterParseFunctions.number(
      filters[FilterKeys.maxTeamSize],
    ),
    [FilterKeys.minStars]: FilterParseFunctions.number(
      filters[FilterKeys.minStars],
    ),
    [FilterKeys.minCreationDate]: FilterParseFunctions.date(true)(
      filters[FilterKeys.minCreationDate],
    ),
    [FilterKeys.maxCreationDate]: FilterParseFunctions.date(false)(
      filters[FilterKeys.maxCreationDate],
    ),
    [FilterKeys.skillRequirements]: FilterParseFunctions.skillRequirements(
      filters[FilterKeys.skillRequirements],
    ),
  }
}
