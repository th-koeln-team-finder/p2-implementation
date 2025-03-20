'use client'

import { useFileUpload } from '@/features/file-upload/file-upload.hooks'
import { useNavigationModalContext } from '@/features/general/components/NavigationModal'
import { useRouter } from '@/features/i18n/routing'
import { CreateProjectIssueList } from '@/features/projects/components/CreateProjectForm/CreateProjectIssueList'
import { CreateProjectLinksList } from '@/features/projects/components/CreateProjectForm/CreateProjectLinksList'
import { CreateProjectPreview } from '@/features/projects/components/CreateProjectForm/CreateProjectPreview'
import { CreateProjectSkills } from '@/features/projects/components/CreateProjectForm/CreateProjectSkills'
import { ProjectPicturesInlinePreview } from '@/features/projects/components/CreateProjectForm/ProjectPicturesInlinePreview'
import {
  createProject,
  createProjectAttachments,
  getUserProfile,
  revalidateProjects,
} from '@/features/projects/projects.actions'
import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { useTagSearch } from '@/features/tag/tag.hook'
import { useFieldGroup, useForm } from '@formsignals/form-react'
import {
  type ZodAdapter,
  configureZodAdapter,
} from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import type { UserSelect } from '@repo/database/schema'
import { FieldError } from '@repo/design-system/components/FormErrors'
import {
  WysiwygEditorForm,
  getStringContentFromEditor,
  useLexicalEditorRef,
} from '@repo/design-system/components/WysiwygEditor'
import { FileUploadForm } from '@repo/design-system/components/custom/file-upload'
import { MultiValueAutoCompleteForm } from '@repo/design-system/components/custom/multi-value-auto-complete'
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
import { clientEnv } from '@repo/env/client'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'

const registerAdapter = configureZodAdapter({
  takeFirstError: true,
})

export function CreateProjectForm() {
  useSignals()
  const [progressState, uploadFile, resetFileProgress] = useFileUpload()
  const router = useRouter()

  const t = useTranslations('createProjects')
  const TagTranslations = useTranslations('tag')
  const translateError = useTranslations('validation')

  const navigationModal = useNavigationModalContext()

  const [sessionUser, setUser] = useState<UserSelect>()
  const { data, isLoading, searchInput, setSearchInput } = useTagSearch()

  //Stepper
  const steps = [
    { id: 'basics', title: t('stepper.main') },
    { id: 'skills', title: t('stepper.skills') },
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
      tags: [],
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
    onSubmit: async ({ resources, pictures, ...values }) => {
      if (!editorRef.current) return null

      const projectId = await createProject(
        values,
        getStringContentFromEditor(editorRef.current),
      )

      const processedResources = await Promise.all(
        resources.map(
          async ({
            file,
            ...resource
          }): Promise<
            [
              Omit<CreateProjectFormValues['resources'][number], 'file'>,
              string | undefined | null,
            ]
          > => {
            if (!file.length) return [resource, null]
            return [
              resource,
              await uploadFile(
                `${projectId}/resources`,
                resource.label,
                file[0],
              ),
            ]
          },
        ),
      )
      const uploadedPictures = await Promise.all(
        pictures.map(
          async (p): Promise<[string, string | undefined | null]> => [
            p.name,
            await uploadFile(`${projectId}/pictures`, p.name, p),
          ],
        ),
      )
      await createProjectAttachments(
        projectId,
        processedResources,
        uploadedPictures,
      )

      resetFileProgress()

      await revalidateProjects()
      setTimeout(() => {
        router.replace(`/projects/${projectId}`)
      }, 0)
    },
  })

  const [currentIndex, setCurrentIndex] = useState(0)

  const basicFieldGroup = useFieldGroup(
    form,
    ['name', 'phase', 'description', 'createdBy', 'pictures'],
    {
      onSubmit: () => setCurrentIndex(1),
    },
  )
  const skillsGroup = useFieldGroup(form, ['skills'], {
    onSubmit: () => setCurrentIndex(2),
  })
  const linksGroup = useFieldGroup(
    form,
    [
      'tags',
      'issues',
      'resources',
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
        return await basicFieldGroup.handleSubmit()
      },

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

            <form.FieldProvider
              name="pictures"
              validator={(files) => {
                if (!files.length) return null
                if (files.length > 5)
                  return translateError('maxFiles', { amount: 5 })
                return null
              }}
            >
              <div className="w-full px-1">
                <Label>{t('resources.fileUpload')}</Label>
                <FileUploadForm
                  accepts="image/jpeg,image/jpg,image/png"
                  multiple
                  placeholder={
                    <ProjectPicturesInlinePreview
                      progressState={progressState}
                      maxFileSize={clientEnv.NEXT_PUBLIC_MAX_FILE_SIZE}
                    />
                  }
                />
                <FieldError />
              </div>
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

      <ContentItem stepId="links">
        <div className="flex w-full flex-col gap-8">
          <div>
            <h2 className="font-semibold text-2xl">{t('titleTimetable')}</h2>
            <p className="mb-2 text-muted-foreground text-sm">
              {t('descriptionTimetable')}
            </p>

            <div className="w-full">
              <form.FieldProvider name="timetableOutput" defaultValue="noTable">
                <div className="mb-2">
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
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                <div>
                  <form.FieldProvider name="ttMon">
                    <Label>{t('timetable.days.monday')}</Label>
                    <InputForm
                      id="tt-mon"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
                <div>
                  <form.FieldProvider name="ttTue">
                    <Label>{t('timetable.days.tuesday')}</Label>
                    <InputForm
                      id="tt-tue"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
                <div>
                  <form.FieldProvider name="ttWed">
                    <Label>{t('timetable.days.wednesday')}</Label>
                    <InputForm
                      id="tt-wed"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
                <div>
                  <form.FieldProvider name="ttThu">
                    <Label>{t('timetable.days.thursday')}</Label>
                    <InputForm
                      id="tt-thu"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
                <div>
                  <form.FieldProvider name="ttFri">
                    <Label>{t('timetable.days.friday')}</Label>
                    <InputForm
                      id="tt-fri"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
                <div>
                  <form.FieldProvider name="ttSat">
                    <Label>{t('timetable.days.saturday')}</Label>
                    <InputForm
                      id="tt-sat"
                      placeholder={t('timetable.days.placeholder')}
                    />
                  </form.FieldProvider>
                </div>
                <div>
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
              <form.FieldProvider
                name="timetableCustom"
                validator={() => {
                  if (!editorRef.current) return null
                  return getStringContentFromEditor(editorRef.current).length <=
                    0
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
            )}
          </div>

          <form.FieldProvider name="tags">
            <div>
              <h2 className="font-semibold text-2xl">{t('titleTags')}</h2>
              <p className="mb-2 text-muted-foreground text-sm">
                {t('descriptionTags')}
              </p>
              <div className="flex flex-col gap-4 py-2">
                <MultiValueAutoCompleteForm
                  containerId="popoverref"
                  onOpenChange={(open) => {
                    if (!navigationModal) return
                    navigationModal.setBlockBackNavigation(open)
                  }}
                  searchInput={searchInput}
                  onSearchInputChange={setSearchInput}
                  data={data ?? []}
                  isLoading={isLoading}
                  placeholder={TagTranslations('placeholderTags')}
                  emptyMessage={TagTranslations('emptyTags')}
                  loadingMessage={TagTranslations('loadingTags')}
                  enableCommaSeparation
                  enableTagUse
                />
                <FieldError />
              </div>
            </div>
          </form.FieldProvider>

          <div>
            <h2 className="font-semibold text-2xl">{t('titleIssues')}</h2>
            <p className="mb-2 text-muted-foreground text-sm">
              {t('descriptionIssues')}
            </p>
            <form.FieldProvider name="issues">
              <CreateProjectIssueList />
            </form.FieldProvider>
          </div>

          <div>
            <h2 className="font-semibold text-2xl">{t('titleResources')}</h2>
            <p className="mb-2 text-muted-foreground text-sm">
              {t('descriptionResources')}
            </p>
            <div>
              <form.FieldProvider name="resources">
                <CreateProjectLinksList progressState={progressState} />
              </form.FieldProvider>
            </div>
          </div>
        </div>
      </ContentItem>

      <ContentItem stepId="review">
        <form.FormProvider>
          <CreateProjectPreview progressState={progressState} />
        </form.FormProvider>
      </ContentItem>
    </StepperComponent>
  )
}
