'use client'

import { useRouter } from '@/features/i18n/routing'
import { CreateProjectIssueList } from '@/features/projects/components/CreateProjectForm/CreateProjectIssueList'
import { CreateProjectLinksList } from '@/features/projects/components/CreateProjectForm/CreateProjectLinksList'
import { CreateProjectPreview } from '@/features/projects/components/CreateProjectForm/CreateProjectPreview'
import { CreateProjectSkills } from '@/features/projects/components/CreateProjectForm/CreateProjectSkills'
import { createProject } from '@/features/projects/projects.actions'
// biome-ignore lint/style/useImportType: import type {CreateProjectFormValues} from "@/features/projects/projects.types";
import { CreateProjectFormValues } from '@/features/projects/projects.types'
import { useFieldGroup, useForm } from '@formsignals/form-react'
import {
  type ZodAdapter,
  configureZodAdapter,
} from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import {
  WysiwygEditorForm,
  getStringContentFromEditor,
  useLexicalEditorRef,
} from '@repo/design-system/components/WysiwygEditor'
import {
  ContentItem,
  StepperComponent,
} from '@repo/design-system/components/stepper'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import {
  SelectContent,
  SelectForm,
  SelectItem,
} from '@repo/design-system/components/ui/select'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { z } from 'zod'

const registerAdapter = configureZodAdapter({
  takeFirstError: true,
})

export function CreateProjectForm() {
  useSignals()
  const router = useRouter()
  const t = useTranslations('createProjects')
  //Stepper
  const steps = [
    { id: 'basics', title: 'Basis' },
    { id: 'skills', title: 'Fähigkeiten' },
    { id: 'timetable', title: 'Zeitplan' },
    { id: 'links', title: 'Links' },
    { id: 'review', title: 'Überblick' },
  ]

  //Form Field Provider
  const form = useForm<CreateProjectFormValues, typeof ZodAdapter>({
    validatorAdapter: registerAdapter,
    defaultValues: {
      name: '',
      description: JSON.stringify({
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: '',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
              textFormat: 0,
              textStyle: '',
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      }),
      phase: '',
      status: 'open',
      skills: [],
      timetableOutput: '',
      ttMon: '',
      ttTue: '',
      ttWed: '',
      ttThu: '',
      ttFri: '',
      ttSat: '',
      ttSun: '',
      timetableCustom: '',
      issues: [],
      address: '',
      ressources: [],
    },
    onSubmit: async (values) => {
      await createProject(values)
      router.push('/projects')
    },
  })

  const [currentIndex, setCurrentIndex] = useState(0)

  const basicFieldGroup = useFieldGroup(
    form,
    ['name', 'phase', 'description'],
    {
      onSubmit: () => setCurrentIndex(1),
    },
  )
  const skillsGroup = useFieldGroup(form, ['skills'], {
    onSubmit: () => setCurrentIndex(2),
  })
  const timeGroup = useFieldGroup(
    form,
    [
      'timetableOutput',
      'ttMon',
      'ttTue',
      'ttWed',
      'ttThu',
      'ttFri',
      'ttSat',
      'ttSun',
      'timetableCustom',
    ],
    {
      onSubmit: () => setCurrentIndex(3),
    },
  )
  const linksGroup = useFieldGroup(form, ['issues', 'address', 'ressources'], {
    onSubmit: () => setCurrentIndex(4),
  })

  //Zeitplan
  const [timetableFormat, setTimetableFormat] = useState('')

  const editorRef = useLexicalEditorRef()

  return (
    <StepperComponent
      steps={steps}
      currentIndex={currentIndex}
      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
      onNext={async () => {
        if (currentIndex === 0) {
          return await basicFieldGroup.handleSubmit()
        }
        if (currentIndex === 1) {
          const skillFields = form.fields
            .peek()
            .filter((field) => field.name.startsWith('skills'))
          await Promise.all(
            skillFields.map((field) => field.validateForEvent('onSubmit')),
          )
          const isSkillFieldInvalid = skillFields.some(
            (field) => !field.isValid.peek(),
          )
          if (isSkillFieldInvalid) return
          return await skillsGroup.handleSubmit()
        }
        if (currentIndex === 2) {
          return await timeGroup.handleSubmit()
        }
        if (currentIndex === 3) {
          const issueFields = form.fields
            .peek()
            .filter((field) => field.name.startsWith('issues'))
          await Promise.all(
            issueFields.map((field) => field.validateForEvent('onSubmit')),
          )
          const isIssueFieldInvalid = issueFields.some(
            (field) => !field.isValid.peek(),
          )
          if (isIssueFieldInvalid) return

          const ressourceFields = form.fields
            .peek()
            .filter((field) => field.name.startsWith('ressources'))
          await Promise.all(
            ressourceFields.map((field) => field.validateForEvent('onSubmit')),
          )
          const isRessourceFieldInvalid = ressourceFields.some(
            (field) => !field.isValid.peek(),
          )
          if (isRessourceFieldInvalid) return

          return await linksGroup.handleSubmit()
        }
      }}
      onPrevious={() => setCurrentIndex((prev) => prev - 1)}
      jumpToStep={setCurrentIndex}
      onReset={() => {
        form.reset()
        setCurrentIndex(0)
      }}
      onDone={async () => {
        await form.handleSubmit()
      }}
    >
      <ContentItem stepId="basics">
        <form.FormProvider>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <form.FieldProvider
                name="name"
                validator={z.string().min(1)}
                validatorOptions={{
                  validateOnChangeIfTouched: true,
                }}
              >
                <Label>{t('name')}</Label>
                <InputForm id="name" placeholder={t('namePlaceholder')} />
                <FieldError />
              </form.FieldProvider>
            </div>
            <div className="w-full lg:w-1/2">
              <form.FieldProvider
                name="phase"
                validator={z.string().min(1)}
                validatorOptions={{
                  validateOnChangeIfTouched: true,
                }}
              >
                <Label>{t('phase')}</Label>
                <InputForm id="phase" placeholder={t('phasePlaceholder')} />
                <FieldError />
              </form.FieldProvider>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <Label>{t('images')}</Label>
              <br />
              FileUpload für Images
            </div>
            <div className="w-full lg:w-1/2">
              <form.FieldProvider
                name="description"
                validator={() => {
                  if (!editorRef.current) return null
                  return getStringContentFromEditor(editorRef.current).length <=
                    0
                    ? 'This field is required'
                    : null
                }}
              >
                <div>
                  <Label>{t('description')}</Label>
                  <WysiwygEditorForm editorRef={editorRef} />
                  <FieldError />
                </div>
              </form.FieldProvider>
            </div>
          </div>
        </form.FormProvider>
      </ContentItem>

      <ContentItem stepId="skills">
        <form.FormProvider>
          <form.FieldProvider name="skills">
            <CreateProjectSkills />
          </form.FieldProvider>
        </form.FormProvider>
      </ContentItem>

      <ContentItem stepId="timetable">
        <form.FormProvider>
          <div className="flex w-full flex-col gap-4">
            <div className="w-full lg:w-1/2">
              <form.FieldProvider
                name="timetableOutput"
                validator={z.enum(['table', 'custom'] as const)}
              >
                <div>
                  <Label>{t('timetable.title')}</Label>
                  <SelectForm
                    onValueChange={(value) => setTimetableFormat(value)}
                    value={timetableFormat}
                    valueProps={{ placeholder: 'Bitte auswählen' }}
                  >
                    <SelectContent>
                      <SelectItem value="table">
                        {t('timetable.table')}
                      </SelectItem>
                      <SelectItem value="custom">
                        {t('timetable.custom')}
                      </SelectItem>
                    </SelectContent>
                  </SelectForm>
                  <FieldError />
                </div>
              </form.FieldProvider>
            </div>

            {timetableFormat === 'table' && (
              <div className="flex w-full flex-col gap-4 lg:flex-row">
                <div className="w-1/7">
                  <form.FieldProvider name="ttMon">
                    <Label>{t('timetable.days.monday')}</Label>
                    <InputForm
                      id="tt-mon"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
                <div className="w-1/7">
                  <form.FieldProvider name="ttTue">
                    <Label>{t('timetable.days.tuesday')}</Label>
                    <InputForm
                      id="tt-tue"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
                <div className="w-1/7">
                  <form.FieldProvider name="ttWed">
                    <Label>{t('timetable.days.wednesday')}</Label>
                    <InputForm
                      id="tt-wed"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
                <div className="w-1/7">
                  <form.FieldProvider name="ttThu">
                    <Label>{t('timetable.days.thursday')}</Label>
                    <InputForm
                      id="tt-thu"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
                <div className="w-1/7">
                  <form.FieldProvider name="ttFri">
                    <Label>{t('timetable.days.friday')}</Label>
                    <InputForm
                      id="tt-fri"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
                <div className="w-1/7">
                  <form.FieldProvider name="ttSat">
                    <Label>{t('timetable.days.saturday')}</Label>
                    <InputForm
                      id="tt-sat"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
                <div className="w-1/7">
                  <form.FieldProvider name="ttSun">
                    <Label>{t('timetable.days.sunday')}</Label>
                    <InputForm
                      id="tt-sun"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
              </div>
            )}
            {timetableFormat === 'custom' && (
              <div className="w-full lg:w-1/2">
                <form.FieldProvider
                  name="timetableCustom"
                  validator={() => {
                    if (!editorRef.current) return null
                    return getStringContentFromEditor(editorRef.current)
                      .length <= 0
                      ? 'This field is required'
                      : null
                  }}
                >
                  <div>
                    <Label>{t('timetable.custom')}</Label>
                    <WysiwygEditorForm editorRef={editorRef} />
                    <FieldError />
                  </div>
                </form.FieldProvider>
              </div>
            )}
          </div>
        </form.FormProvider>
      </ContentItem>

      <ContentItem stepId="links">
        <form.FormProvider>
          <div className="flex w-full flex-col">
            <Label>(Github) Issues</Label>
            <form.FieldProvider name="issues">
              <CreateProjectIssueList editorRef={editorRef} />
            </form.FieldProvider>
          </div>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <Label>{t('location')}</Label>
              <form.FieldProvider name="address">
                <InputForm
                  id="address"
                  placeholder={t('locationPlaceholder')}
                />
              </form.FieldProvider>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full">
              <Label>{t('linksTitle')}</Label>
              <div>
                <form.FieldProvider name="ressources">
                  <CreateProjectLinksList />
                </form.FieldProvider>
              </div>
            </div>
          </div>
        </form.FormProvider>
      </ContentItem>

      <ContentItem stepId="review">
        <form.FormProvider>
          <CreateProjectPreview />
        </form.FormProvider>
      </ContentItem>
    </StepperComponent>
  )
}
