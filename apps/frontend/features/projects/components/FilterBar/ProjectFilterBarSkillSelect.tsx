'use client'

import { useNavigationModalContext } from '@/features/general/components/NavigationModal'
import { useSkillSearch } from '@/features/skills/skills.hooks'
import {
  unSignalifyValueSubscribed,
  useFieldContext,
} from '@formsignals/form-react'
import { useComputed, useSignals } from '@preact/signals-react/runtime'
import { MultiValueAutoComplete } from '@repo/design-system/components/custom/multi-value-auto-complete'
import { Rating } from '@repo/design-system/components/custom/rating'
import { Button } from '@repo/design-system/components/ui/button'
import { SquircleIcon, XIcon } from 'lucide-react'

export function ProjectFilterBarSkillSelect() {
  useSignals()
  const field = useFieldContext<
    Array<{ label: string; value: string; level: number }>,
    ''
  >()
  const selectedValues = useComputed(() =>
    unSignalifyValueSubscribed(field.data),
  )

  const navigationModal = useNavigationModalContext()
  const { data, isLoading, searchInput, setSearchInput } =
    useSkillSearch('project')

  return (
    <div>
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
        placeholder="Search for skills..."
        loadingMessage="Loading..."
        emptyMessage="No skills found"
      />
      <div className="flex flex-row flex-wrap gap-2 pt-2">
        {field.data.value.map((skill, index) => (
          <field.SubFieldProvider key={skill.key} name={`${index}`}>
            <ProjectFilterBarSkillSelectEntry />
          </field.SubFieldProvider>
        ))}
      </div>
    </div>
  )
}

function ProjectFilterBarSkillSelectEntry() {
  const field = useFieldContext<
    { label: string; value: string; level: number },
    ''
  >()
  return (
    <div className="flex w-full flex-col rounded border border-border bg-background px-3 py-2 text-sm md:flex-row md:items-center">
      <p>{field.data.value.label.value}</p>
      <Rating
        rating={field.data.value.level.value}
        onRatingChange={(rating) => {
          field.data.value.level.value = rating
        }}
        totalStars={5}
        showText={false}
        Icon={<SquircleIcon />}
        className="md:ml-auto"
        rowClassName="gap-0.5"
        starClassName="mt-1 md:mt-0 size-4"
      />
      <Button
        size="icon"
        variant="destructive"
        className="mt-2 ml-auto h-6 w-6 md:mt-0 md:ml-4 [&_svg]:size-3"
        onClick={() => field.removeSelfFromArray()}
      >
        <XIcon />
      </Button>
    </div>
  )
}
