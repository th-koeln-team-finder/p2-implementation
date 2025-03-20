import {
  UserFilterKeys,
  UserFilterParseFunctions,
  type UserFilterSearchParams,
} from '@/features/projects/components/FindSomeone/FindSomeone.constants'

export function parseUserFilters(filters: UserFilterSearchParams) {
  return {
    [UserFilterKeys.minSkillAmount]: UserFilterParseFunctions.number(
      filters[UserFilterKeys.minSkillAmount],
    ),
  }
}
