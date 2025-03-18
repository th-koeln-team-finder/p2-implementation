import { useDebouncedValue } from '@/features/general/utils.hooks'
import { searchSkills } from '@/features/skills/skills.queries'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type UsageType = 'project' | 'user' | 'total'

export function useSkillSearch(
  usage: UsageType = 'total',
  enableNewSkillCreation = false,
) {
  const translate = useTranslations('skill')
  const [searchInput, setSearchInput] = useState<string>('')
  const [debouncedSearchInput, isDebouncing] = useDebouncedValue(searchInput)

  const { data, isLoading } = useQuery<
    { label: string; value: string; labelRight?: string }[]
  >({
    queryFn: async () => {
      const skills = await searchSkills(debouncedSearchInput, 25)
      if (!skills) return []
      const mappedSkills = skills.map((skill) => {
        let usageNum = skill.usedCount
        if (usage === 'user') usageNum = skill.usedCountUsers
        if (usage === 'project') usageNum = skill.usedCountProject
        return {
          label: skill.skill,
          value: skill.id,
          labelRight: translate('labelRightUses', { usage: usageNum }),
        }
      })
      if (
        enableNewSkillCreation &&
        debouncedSearchInput &&
        !skills.some(
          (skill) =>
            skill.skill.toLowerCase() === debouncedSearchInput.toLowerCase(),
        )
      ) {
        mappedSkills.unshift({
          label: translate('createNewSkill', {
            skillName: debouncedSearchInput,
          }),
          value: `new:${debouncedSearchInput}`,
          labelRight: translate('labelRightNew'),
        })
      }
      return mappedSkills
    },
    queryKey: ['skill-search', debouncedSearchInput],
  })

  return {
    searchInput,
    setSearchInput,
    isLoading: isLoading || isDebouncing,
    data,
  }
}
