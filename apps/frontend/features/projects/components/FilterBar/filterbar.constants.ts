import { endOfDay, parse, startOfDay } from 'date-fns'

export const FilterKeys = {
  minTeamSize: 'filters[teamSize][min]',
  maxTeamSize: 'filters[teamSize][max]',
  minCreationDate: 'filters[creationDate][min]',
  maxCreationDate: 'filters[creationDate][max]',
  minStars: 'filters[minStars]',
  skillRequirements: 'filters[skillRequirements]',
} as const

export type FilterSearchParams = {
  [FilterKeys.minTeamSize]?: string
  [FilterKeys.maxTeamSize]?: string
  [FilterKeys.minCreationDate]?: string
  [FilterKeys.maxCreationDate]?: string
  [FilterKeys.minStars]?: string
  [FilterKeys.skillRequirements]?: string
}

export type Skill = {
  label: string
  value: string
  level: number
}

export const FilterParseFunctions = {
  date: (isStart: boolean) => (v?: string | null) => {
    if (!v) return null
    const parsedRaw = parse(v, 'dd.MM.y', new Date())
    const parsed = isStart ? startOfDay(parsedRaw) : endOfDay(parsedRaw)
    if (Number.isNaN(parsed.getTime())) return null
    return parsed
  },
  number: (v?: string | null) => {
    if (!v) return null
    const parsed = Number.parseInt(v)
    if (!v || Number.isNaN(parsed)) return null
    return parsed
  },
  skillRequirements: (v?: string | null) => {
    if (!v) return []
    const skills = v.split(',')
    return skills.map((skill) => {
      const [id, name, level] = skill.split(':')
      return {
        value: decodeURIComponent(id),
        label: decodeURIComponent(name),
        level: Number.parseInt(level),
      }
    })
  },
}
