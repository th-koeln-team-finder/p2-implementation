'use client'

import { useFileUpload } from '@/features/file-upload/file-upload.hooks'
import { useRouter } from '@/features/i18n/routing'
import { CreateProjectIssueList } from '@/features/projects/components/CreateProjectForm/CreateProjectIssueList'
import { CreateProjectLinksList } from '@/features/projects/components/CreateProjectForm/CreateProjectLinksList'
import { CreateProjectPreview } from '@/features/projects/components/CreateProjectForm/CreateProjectPreview'
import { CreateProjectSkills } from '@/features/projects/components/CreateProjectForm/CreateProjectSkills'
import {
  createProject,
  createProjectUploadedData,
  getUserProfile,
  revalidateProjects,
} from '@/features/projects/projects.actions'
import type { CreateProjectFormValues } from '@/features/projects/projects.types'
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
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { CreateProjectPictureList } from '@/features/projects/components/CreateProjectForm/CreateProjectPictureList'
import type { UserSelect } from '@repo/database/schema'

const registerAdapter = configureZodAdapter({
  takeFirstError: true,
})

export function CreateProjectForm() {
  useSignals()
  const [progressState, uploadFile, resetFileProgress] = useFileUpload()
  const router = useRouter()
  const t = useTranslations('createProjects')
  const translateError = useTranslations('validation')
  const [sessionUser, setUser] = useState<UserSelect>()
  //Stepper
  const steps = [
    { id: 'basics', title: t('stepper.main') },
    { id: 'skills', title: t('stepper.skills') },
    { id: 'timetable', title: t('stepper.timeManagement') },
    { id: 'links', title: t('stepper.details') },
    { id: 'review', title: t('stepper.preview') },
  ]
  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await getUserProfile()
      if (profile) setUser(profile)
    }
    fetchUserProfile()
  }, [])

  //Form Field Provider
  const form = useForm<CreateProjectFormValues, typeof ZodAdapter>({
    validatorAdapter: registerAdapter,
    defaultValues: {
      name: '',
      createdBy: sessionUser ? sessionUser.id : '',
      description: '',
      phase: '',
      status: 'open',
      skills: [],
      participants: sessionUser ? [{ Users: sessionUser }] : [],
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
      resources: [],
      pictures: [],
    },
    onSubmit: async (values) => {
      if (!editorRef.current) return null
      const serverActionData = {
        ...values,
        resources: values.resources.map((r) => ({
          ...r,
          file: [],
        })),
        pictures: values.pictures.map((p) => ({
          ...p,
          file: [],
        })),
      }
      console.log(serverActionData.resources+"-- ServerActionData - Resources")
      console.log(serverActionData.pictures+"-- ServerActionData - Pictures")

      const projectId = await createProject(
        serverActionData,
        getStringContentFromEditor(editorRef.current),
      )
      const uploadedFileResources = await Promise.all(
        values.resources.map(async ({ file, label, href }) => {
          if (!file.length) {
            return {
              label,
              href,
              projectId,
            }
          }
          const fileId = await uploadFile(
            `${projectId}/resources`,
            label,
            file[0],
          )
          resetFileProgress(file[0].name)
          return {
            label,
            fileUpload: fileId,
            projectId,
          }
        }),
      )
      const uploadedPictures = await Promise.all(
        values.pictures.map(async ({ file, label }) => {
          if (!file.length) {
            return {
              projectId,
              label,
            }
          }
          const fileId = await uploadFile(
            `${projectId}/pictures`,
            label,
            file[0],
          )
          resetFileProgress(file[0].name)

          return {
            fileUpload: fileId,
            label,
            projectId,
          }
        }),
      )

      await createProjectUploadedData(projectId, {
        resources: uploadedFileResources,
      })
      await createProjectUploadedData(projectId, {
        pictures: uploadedPictures,
      })
      await revalidateProjects()
      setTimeout(() => {
        router.replace(`/projects/${projectId}`)
      }, 0)
    },

  })


  const [currentIndex, setCurrentIndex] = useState(0)

  const basicFieldGroup = useFieldGroup(
    form,
    ['name', 'phase', 'description', 'createdBy','pictures'],
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
  const linksGroup = useFieldGroup(form, ['issues', 'resources'], {
    onSubmit: () => setCurrentIndex(4),
  })

  //Zeitplan
  const [timetableFormat, setTimetableFormat] = useState('')

  const editorRef = useLexicalEditorRef()

  const stepperChecks = useMemo(
    () => [
      async () => {
        const projectFields = form.fields
            .peek()
            .filter((field) => field.name.startsWith('pictures'))
        await Promise.all(
            projectFields.map((field) => field.validateForEvent('onSubmit')),
        )
        const isResourceFieldInvalid = projectFields.some(
            (field) => !field.isValid.peek(),
        )
        if (isResourceFieldInvalid) return
      return await basicFieldGroup.handleSubmit()},

      async () => {
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
      },
      async () => await timeGroup.handleSubmit(),
      async () => {
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

        const resourceFields = form.fields
          .peek()
          .filter((field) => field.name.startsWith('resources'))
        await Promise.all(
          resourceFields.map((field) => field.validateForEvent('onSubmit')),
        )
        const isResourceFieldInvalid = resourceFields.some(
          (field) => !field.isValid.peek(),
        )
        if (isResourceFieldInvalid) return

        return await linksGroup.handleSubmit()
      },
    ],
    [
      basicFieldGroup.handleSubmit,
      linksGroup.handleSubmit,
      timeGroup.handleSubmit,
      form.fields.peek,
      skillsGroup.handleSubmit,
    ],
  )

  return (
    <StepperComponent
      steps={steps}
      doneDisabled={!form.canSubmit.value}
      currentIndex={currentIndex}
      onNext={async () => {
        await stepperChecks[currentIndex]?.()
      }}
      onPrevious={() => setCurrentIndex((prev) => prev - 1)}
      jumpToStep={setCurrentIndex}
      onDone={async () => {
        await form.handleSubmit()
      }}
    >
      <ContentItem stepId="basics">
        <form.FormProvider>
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div className="flex w-full max-w-2xl flex-col gap-4">
              <form.FieldProvider
                name="name"
                validator={z
                  .string({ required_error: translateError('required') })
                  .min(1, translateError('minLengthX', { amount: 1 }))}
                validatorOptions={{
                  validateOnChangeIfTouched: true,
                }}
              >
                <div>
                  <Label>{t('main.name')}</Label>
                  <InputForm
                    id="name"
                    placeholder={t('main.namePlaceholder')}
                  />

                  <FieldError />
                </div>
              </form.FieldProvider>
              <form.FieldProvider name="phase">
                <div>
                  <Label>{t('main.phase')}</Label>
                  <InputForm
                    id="phase"
                    placeholder={t('main.phasePlaceholder')}
                  />
                  <FieldError />
                </div>
              </form.FieldProvider>
            </div>

            <form.FieldProvider name="pictures">
              <CreateProjectPictureList
                progressState={progressState}
              />
            </form.FieldProvider>
          </div>

          <form.FieldProvider
            name="description"
            validator={() => {
              if (!editorRef.current) return null
              return getStringContentFromEditor(editorRef.current).length <= 0
                ? translateError('required')
                : null
            }}
          >
            <div>
              <Label>{t('main.description')}</Label>
              <WysiwygEditorForm
                editorRef={editorRef}
                placeholder={t('main.descriptionPlaceholder')}
                className="min-h-56"
              />
              <FieldError />
            </div>
          </form.FieldProvider>
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
              <form.FieldProvider name="timetableOutput" defaultValue="noTable">
                <div>
                  <Label>{t('timetable.title')}</Label>
                  <SelectForm
                    onValueChange={(value) => setTimetableFormat(value)}
                    value={timetableFormat}
                    valueProps={{ placeholder: t('details.pleaseSelect') }}
                  >
                    <SelectContent>
                      <SelectItem value="table">
                        {t('timetable.table')}
                      </SelectItem>
                      <SelectItem value="custom">
                        {t('timetable.custom')}
                      </SelectItem>
                      <SelectItem value="noTable">
                        {t('timetable.noTable')}
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
                      ? translateError('required')
                      : null
                  }}
                >
                  <div>
                    <WysiwygEditorForm
                      editorRef={editorRef}
                      placeholder={t('timetable.customPlaceholder')}
                    />
                    <FieldError />
                  </div>
                </form.FieldProvider>
              </div>
            )}
            {timetableFormat === 'noTable' && (
              <div className="w-full lg:w-1/2" />
            )}
          </div>
        </form.FormProvider>
      </ContentItem>

      <ContentItem stepId="links">
        <form.FormProvider>
          <div className="flex w-full flex-col">
            <Label>{t('issues.sectionTitle')}</Label>
            <form.FieldProvider name="issues">
              <CreateProjectIssueList />
            </form.FieldProvider>
          </div>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full">
              <Label>{t('linksTitle')}</Label>
              <div>
                <form.FieldProvider name="resources">
                  <CreateProjectLinksList progressState={progressState} />
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
