export const UserFilterKeys = {
  minSkillAmount: 'filters[skill][min]',
} as const

export type Skill = {
  label: string
  value: string
  level: number
}
export type UserFilterSearchParams = {
  [UserFilterKeys.minSkillAmount]?: string
}

export const UserFilterParseFunctions = {
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
