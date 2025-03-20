'use client'
import { revalidateBrainstorms } from '@/features/brainstorm/brainstorm.actions'
import { useDebounceFunction } from '@/features/general/utils.hooks'
import { ProjectFilterBarSkillSelect } from '@/features/projects/components/FilterBar/ProjectFilterBarSkillSelect'
import { FilterKeys } from '@/features/projects/components/FilterBar/filterbar.constants'
import { useFilterBarQueryParams } from '@/features/projects/components/FilterBar/filterbar.hooks'
import { revalidateProjects } from '@/features/projects/projects.actions'
import { useForm } from '@formsignals/form-react'
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import { Button } from '@repo/design-system/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible'
import { DatePickerForm } from '@repo/design-system/components/ui/datepicker'
import { Input, InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { Toggle } from '@repo/design-system/components/ui/toggle'
import { cn } from '@repo/design-system/lib/utils'
import { format, parse } from 'date-fns'
import { FilterIcon, InfoIcon, Loader2Icon, SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { useState } from 'react'
import { z } from 'zod'

export function ProjectFilterBar() {
  useSignals()

  const translate = useTranslations('projects.filterbar')
  const translateValidation = useTranslations('validation')

  const [filters, setFilters] = useFilterBarQueryParams()
  const [search, setSearchRaw] = useQueryState('search')
  const [_, setOffset] = useQueryState('offset')

  const [searchInput, setSearchInput] = useState(search ?? '')
  const [setSearch, isLoading] = useDebounceFunction(async (input: string) => {
    await Promise.all([setSearchRaw(input), setOffset('0')])
    await revalidateBrainstorms()
  }, 500)

  const form = useForm({
    validatorAdapter: ZodAdapter,
    defaultValues: {
      skillRequirements: filters[FilterKeys.skillRequirements] ?? [],
      teamSize: {
        min: filters[FilterKeys.minTeamSize],
        max: filters[FilterKeys.maxTeamSize],
      },
      minStars: filters[FilterKeys.minStars],
      dateRange: {
        min: filters[FilterKeys.minCreationDate],
        max: filters[FilterKeys.maxCreationDate],
      },
    },
    onSubmit: async (values) => {
      await setFilters({
        [FilterKeys.minTeamSize]: values.teamSize.min,
        [FilterKeys.maxTeamSize]: values.teamSize.max,
        [FilterKeys.minCreationDate]: values.dateRange.min,
        [FilterKeys.maxCreationDate]: values.dateRange.max,
        [FilterKeys.minStars]: values.minStars,
        [FilterKeys.skillRequirements]: values.skillRequirements,
      })
      await revalidateProjects()
    },
  })

  return (
    <Collapsible className="mb-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute top-2 left-3 text-muted-foreground" />
          {isLoading && (
            <Loader2Icon className="absolute top-2 right-3 animate-spin" />
          )}
          <Input
            type="search"
            autoFocus
            placeholder={translate('searchPlaceholder')}
            className={cn(
              'h-10 flex-1 pl-11 md:text-md',
              isLoading && '[&::-webkit-search-cancel-button]:hidden',
            )}
            value={searchInput}
            onChange={(e) => {
              setSearch(e.target.value)
              setSearchInput(e.target.value)
            }}
          />
        </div>
        <CollapsibleTrigger asChild>
          <Toggle variant="outline" className="group h-10 px-4">
            <FilterIcon className="group-data-[state='open']:fill-foreground" />
            {translate('filterButton')}
          </Toggle>
        </CollapsibleTrigger>
      </div>
      <div className="mt-2 flex flex-row items-center gap-2 rounded border-primary border-l-4 bg-primary/20 p-2 text-foreground text-sm">
        <InfoIcon className="size-4 min-w-4" />
        {translate('searchNotice')}
      </div>
      <CollapsibleContent className="mt-2 rounded bg-muted p-4">
        <form.FormProvider>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              return form.handleSubmit()
            }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="md:col-span-2">
                <Label>{translate('teamSizeLabel')}</Label>
                <div className="flex flex-col gap-2 md:flex-row md:items-start">
                  <form.FieldProvider
                    name="teamSize.min"
                    transformFromBinding={(value: string) => {
                      if (!value) return null
                      const parsedValue = Number.parseInt(value)
                      if (Number.isNaN(parsedValue))
                        return [0, translateValidation('number')]
                      return parsedValue
                    }}
                    transformToBinding={(value, isValid, buffer) => {
                      return isValid
                        ? (value?.toString() ?? '')
                        : (buffer ?? '')
                    }}
                    validator={z
                      .number({
                        invalid_type_error: translateValidation('number'),
                      })
                      .positive(translateValidation('positive'))
                      .nullable()}
                  >
                    <div className="flex-1">
                      <div className="flex flex-1 flex-row items-start">
                        <div className="flex h-9 flex-row items-center rounded-l border border-border bg-muted px-2 text-muted-foreground text-sm">
                          {translate('teamSizeMinPrefix')}
                        </div>
                        <InputForm
                          useTransformed
                          type="number"
                          placeholder={translate('teamSizeMinPlaceholder')}
                          className="rounded-none rounded-r bg-background"
                        />
                      </div>
                      <FieldError />
                    </div>
                  </form.FieldProvider>
                  <form.FieldProvider
                    name="teamSize.max"
                    transformFromBinding={(value: string) => {
                      if (!value) return null
                      const parsedValue = Number.parseInt(value)
                      if (Number.isNaN(parsedValue))
                        return [0, translateValidation('number')]
                      return parsedValue
                    }}
                    transformToBinding={(value, isValid, buffer) => {
                      return isValid
                        ? (value?.toString() ?? '')
                        : (buffer ?? '')
                    }}
                    validator={z
                      .number({
                        invalid_type_error: translateValidation('number'),
                      })
                      .positive(translateValidation('positive'))
                      .nullable()}
                  >
                    <div className="flex-1">
                      <div className="flex flex-1 flex-row items-start">
                        <div className="flex h-9 flex-row items-center rounded-l border border-border bg-muted px-2 text-muted-foreground text-sm">
                          {translate('teamSizeMaxPrefix')}
                        </div>
                        <InputForm
                          useTransformed
                          type="number"
                          placeholder={translate('teamSizeMaxPlaceholder')}
                          className="rounded-none rounded-r bg-background"
                        />
                      </div>
                      <FieldError />
                    </div>
                  </form.FieldProvider>
                </div>
              </div>
              <div className="md:col-span-2">
                <Label>{translate('creationDateLabel')}</Label>
                <div className="flex flex-col gap-2 md:flex-row md:items-start">
                  <form.FieldProvider
                    name="dateRange.min"
                    transformFromBinding={(dateString: string) => {
                      if (!dateString) return null
                      const date = parse(dateString, 'dd.MM.y', new Date())
                      if (Number.isNaN(date.getTime()))
                        return [null, translateValidation('date')]
                      return date
                    }}
                    transformToBinding={(value, isValid, buffer = '') =>
                      isValid ? (value ? format(value, 'dd.MM.y') : '') : buffer
                    }
                  >
                    <div className="flex-1">
                      <div className="flex flex-1 flex-row items-stretch">
                        <div className="flex flex-row items-center rounded-l border border-border bg-muted px-2 text-muted-foreground text-sm">
                          {translate('creationDateFromPrefix')}
                        </div>
                        <DatePickerForm
                          className="rounded-none rounded-r bg-background"
                          containerClassName="min-w-0"
                        />
                      </div>
                      <FieldError />
                    </div>
                  </form.FieldProvider>
                  <form.FieldProvider
                    name="dateRange.max"
                    transformFromBinding={(dateString: string) => {
                      if (!dateString) return null
                      const date = parse(dateString, 'dd.MM.y', new Date())
                      if (Number.isNaN(date.getTime()))
                        return [null, translateValidation('date')]
                      return date
                    }}
                    transformToBinding={(value, isValid, buffer = '') =>
                      isValid ? (value ? format(value, 'dd.MM.y') : '') : buffer
                    }
                  >
                    <div className="flex-1">
                      <div className="flex flex-1 flex-row items-stretch">
                        <div className="flex flex-row items-center rounded-l border border-border bg-muted px-2 text-muted-foreground text-sm">
                          {translate('creationDateToPrefix')}
                        </div>
                        <DatePickerForm
                          className="rounded-none rounded-r bg-background"
                          containerClassName="min-w-0"
                        />
                      </div>
                      <FieldError />
                    </div>
                  </form.FieldProvider>
                </div>
              </div>
              <div>
                <Label>Min Stars</Label>
                <form.FieldProvider
                  name="minStars"
                  transformFromBinding={(value: string) => {
                    if (!value) return null
                    const parsedValue = Number.parseInt(value)
                    if (Number.isNaN(parsedValue))
                      return [0, translateValidation('number')]
                    return parsedValue
                  }}
                  transformToBinding={(value, isValid, buffer) => {
                    return isValid ? (value?.toString() ?? '') : (buffer ?? '')
                  }}
                  validator={z
                    .number({
                      invalid_type_error: translateValidation('number'),
                    })
                    .positive(translateValidation('positive'))
                    .nullable()}
                >
                  <InputForm
                    useTransformed
                    type="number"
                    placeholder={translate('minStarsPlaceholder')}
                    className=" bg-background"
                  />
                  <FieldError />
                </form.FieldProvider>
              </div>
              <div className="md:col-span-3">
                <Label>{translate('skillRequirementsLabel')}</Label>
                <form.FieldProvider name="skillRequirements">
                  <ProjectFilterBarSkillSelect />
                </form.FieldProvider>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row">
              <Button
                variant="ghost"
                type="button"
                onClick={async () => {
                  await setFilters({
                    [FilterKeys.minTeamSize]: null,
                    [FilterKeys.maxTeamSize]: null,
                    [FilterKeys.minCreationDate]: null,
                    [FilterKeys.maxCreationDate]: null,
                    [FilterKeys.minStars]: null,
                    [FilterKeys.skillRequirements]: null,
                  })
                  form.reset()
                  await revalidateProjects()
                }}
              >
                {translate('resetButton')}
              </Button>
              <Button>{translate('applyButton')}</Button>
            </div>
          </form>
        </form.FormProvider>
      </CollapsibleContent>
    </Collapsible>
  )
}
