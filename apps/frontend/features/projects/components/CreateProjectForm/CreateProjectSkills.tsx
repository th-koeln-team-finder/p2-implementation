'use client'

import { useNavigationModalContext } from '@/features/general/components/NavigationModal'
import type { CreateProjectFormSkills } from '@/features/projects/projects.types'
import { useSkillSearch } from '@/features/skills/skills.hooks'
import {
  unSignalifyValueSubscribed,
  useFieldContext,
} from '@formsignals/form-react'
import type { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { useComputed } from '@preact/signals-react/runtime'
import { MultiValueAutoComplete } from '@repo/design-system/components/custom/multi-value-auto-complete'
import { RatingForm } from '@repo/design-system/components/custom/rating'
import { Button } from '@repo/design-system/components/ui/button'
import { SquircleIcon, TrashIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function CreateProjectSkills() {
  useSignals()
  const field = useFieldContext<
    CreateProjectFormSkills,
    'skills',
    never,
    typeof ZodAdapter,
    typeof ZodAdapter
  >()
  const selectedValues = useComputed(() =>
    unSignalifyValueSubscribed(field.data),
  )

  const t = useTranslations('createProjects.skills')
  const translateSkill = useTranslations('skill')

  const navigationModal = useNavigationModalContext()
  const { data, isLoading, searchInput, setSearchInput } = useSkillSearch(
    'project',
    true,
  )

  return (
    <div>
      <h2 className="font-semibold text-2xl">{t('title')}</h2>
      <p className="mb-4 text-muted-foreground text-sm">{t('description')}</p>
      <div id="popoverref" />
      <MultiValueAutoComplete
        values={selectedValues.value}
        onValuesChange={(
          values: Array<{ label: string; value: string; level?: number }>,
        ) => {
          field.handleChange(
            values.map((v) => {
              v.level ??= 1
              return v as { label: string; value: string; level: number }
            }),
          )
        }}
        containerId="popoverref"
        onOpenChange={(open) => {
          if (!navigationModal) return
          navigationModal.setBlockBackNavigation(open)
        }}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        data={data ?? []}
        isLoading={isLoading}
        clearAfterSelect
        placeholder={translateSkill('searchPlaceholder')}
        loadingMessage={translateSkill('loadingMessage')}
        emptyMessage={translateSkill('emptyMessage')}
      />
      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!field.data.value.length && (
          <p className="col-span-full p-2 text-center text-muted-foreground text-sm italic">
            {t('emptySkills')}
          </p>
        )}
        {field.data.value.map((skill, index) => (
          <field.SubFieldProvider key={skill.key} name={`${index}`}>
            <CreateProjectSkillsEntry />
          </field.SubFieldProvider>
        ))}
      </div>
    </div>
  )
}

function CreateProjectSkillsEntry() {
  const field = useFieldContext<CreateProjectFormSkills['skills'][number], ''>()
  return (
    <div className="flex flex-row items-center rounded bg-muted p-2 text-sm">
      <p>{field.data.value.label.value}</p>
      <div className="ml-auto flex flex-row items-center gap-2">
        <field.SubFieldProvider name="level">
          <RatingForm
            totalStars={5}
            showText={false}
            Icon={<SquircleIcon />}
            rowClassName="gap-0.5"
            starClassName="size-4"
          />
        </field.SubFieldProvider>
        <Button
          variant="destructive"
          size="icon"
          className="ml-auto h-6 w-6 [&_svg]:size-3"
          onClick={() => field.removeSelfFromArray()}
        >
          <TrashIcon />
        </Button>
      </div>
    </div>
  )
}
