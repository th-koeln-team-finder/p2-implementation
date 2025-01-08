'use client'

import { CreateProjectIssueList } from '@/features/projects/components/CreateProjectForm/CreateProjectIssueList'
import { createProjectWithIssues } from '@/features/projects/projects.actions'
import { useFieldGroup, useForm } from '@formsignals/form-react'
import {
  type ZodAdapter,
  configureZodAdapter,
} from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import {
  ContentItem,
  StepperComponent,
} from '@repo/design-system/components/stepper'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import {
  SelectContent, SelectForm,
  SelectItem,
} from '@repo/design-system/components/ui/select'
import { useState } from 'react'
import { z } from 'zod'
import {WysiwygEditorForm} from "@repo/design-system/components/WysiwygEditor";
import {CreateProjectSkills} from "@/features/projects/components/CreateProjectForm/CreateProjectSkills";
import {CreateProjectLinksList} from "@/features/projects/components/CreateProjectForm/CreateProjectLinksList";

const registerAdapter = configureZodAdapter({
  takeFirstError: true,
})

type Index = {
  name: string
  description: string
  phase: string
  status: 'open' | 'closed'
  skills: Array<{
    skill: string
    level: string
  }>
  timetableOutput: string
  timetableTable: Array<{
    value: string
  }>
  timetableCustom: string
  issues: Array<{
    title: string
    description: string
  }>
  address: string
  links: Array<{
    url: string
    file: string
  }>
}

export function CreateProjectForm() {
  useSignals()
  //Stepper
  const steps = [
    { id: 'basics', title: 'Basis', description: 'Provide shipping details' },
    { id: 'skills', title: 'Fähigkeiten', description: 'Review your details' },
    { id: 'timetable', title: 'Zeitplan', description: 'Review your details' },
    { id: 'links', title: 'Links', description: 'Review your details' },
    { id: 'review', title: 'Überblick', description: 'Review your details' },
  ]

  //Form Field Provider
  const form = useForm<Index, typeof ZodAdapter>({
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
                  text: 'This is the default node',
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
      skills: [{ skill: '', level: '' }],
      timetableOutput: '',
      timetableTable: [],
      timetableCustom: JSON.stringify({
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'This is the default node',
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
      issues: [],
      address: '',
      links: [],
    },
    onSubmit: async (values) => {
      await createProjectWithIssues(values)
    },
  })

  const basicFieldGroup = useFieldGroup(form, ['name', 'phase', 'description', 'skills', 'timetableOutput', 'timetableTable', 'timetableCustom', 'address','links'])

  console.log(form);
  console.log(Object.keys(form));

  //Zeitplan
  const [timetableFormat, setTimetableFormat] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <StepperComponent
      steps={steps}
      currentIndex={currentIndex}
      onNext={async () => {
        if (currentIndex < steps.length) {
          await basicFieldGroup.handleSubmit()
          if (basicFieldGroup.isValid.peek()) {
            setCurrentIndex(currentIndex + 1)
          }
        }
      }}
      onPrevious={() => setCurrentIndex((prev) => prev - 1)}
      jumpToStep={setCurrentIndex}
      onReset={() => {
        form.reset()
        setCurrentIndex(0)
      }}
    >
      <ContentItem stepId="basics">
        <form.FormProvider>
          <div className="flex w-full flex-row gap-4">
            <div className="w-1/2">
              <form.FieldProvider
                name="name"
                validator={z.string().min(1)}
                validatorOptions={{
                  validateOnChangeIfTouched: true,
                }}
              >
                <Label>Projektname</Label>
                <InputForm id="name" placeholder="Type here..." />
                <FieldError />
              </form.FieldProvider>
            </div>
            <div className="w-1/2">
              <form.FieldProvider
                  name="phase"
                  validator={z.string().min(1)}
                  validatorOptions={{
                    validateOnChangeIfTouched: true,
                  }}
              >
                <Label>Projektphase</Label>
                <InputForm id="phase" placeholder="Type here..."/>
                <FieldError/>
              </form.FieldProvider>
            </div>
          </div>

          <div className="flex w-full flex-row gap-4">
            <div className="w-1/2">
              <Label>Images</Label>
              <br />
              FileUpload für Images
            </div>
            <div className="w-1/2">

              <form.FieldProvider name="description">
                <div>
                  <Label>Description</Label>
                  <WysiwygEditorForm/>
                  {/*TODO Field Error <FieldError/>*/}
                </div>
              </form.FieldProvider>
            </div>
          </div>
        </form.FormProvider>
      </ContentItem>

      <ContentItem stepId="skills">
          <form.FieldProvider name="skills"
                              /* Field Errors
                              validator={z.object({
                                skills: z.array(
                                  z.object({
                                    skill: z.string().min(1, "Skill is required"),
                                    level: z.union([
                                      z.string().min(1, "Level is required"),
                                      z.number().min(1).max(5, "Level must be between 1 and 5")
                                    ]),
                                  })
                                )}
                              )}
                              validatorOptions={{
                                validateOnChangeIfTouched: true,
                              }}*/>
            <CreateProjectSkills/>
          </form.FieldProvider>
      </ContentItem>
      <ContentItem stepId="timetable">
      <form.FormProvider>
          <div className="flex w-full flex-col gap-4">
            <div className="w-1/2">
              <form.FieldProvider
                  name="timetableOutput"
                  validator={z
                      .enum(['choose', 'table', 'custom'] as const)
                      .refine(
                          (v) => v !== 'choose',
                          'Oh come on decide now already',
                      )}
              >
                <div>
                  <Label>Ausgabe der Timetable</Label>
                  <SelectForm onValueChange={(value) => setTimetableFormat(value)}
                              value={timetableFormat || 'choose'}>
                    <SelectContent>
                      <SelectItem value="choose">Bitte auswählen...</SelectItem>
                      <SelectItem value="table">Tabelle</SelectItem>
                      <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                    </SelectContent>
                  </SelectForm>
                  <FieldError/>
                </div>
              </form.FieldProvider>
            </div>

            {/* TODO Field Errors */}
            {timetableFormat === 'table' && (
                <div className="flex w-full flex-row gap-4">
                  <form.FieldProvider name="timetableTable">
                    <div className="w-1/7">
                        <Label>Montag</Label>
                        <InputForm id="tt-mon" placeholder="Type here..."/>
                        <FieldError/>
                    </div>
                    <div className="w-1/7">
                      <Label>Dienstag</Label>
                      <InputForm id="tt-tue" placeholder="Type here..."/>
                      <FieldError/>
                    </div>
                    <div className="w-1/7">
                      <Label>Mittwoch</Label>
                      <InputForm id="tt-wed" placeholder="Type here..."/>
                      <FieldError/>
                    </div>
                    <div className="w-1/7">
                      <Label>Donnerstag</Label>
                      <InputForm id="tt-thu" placeholder="Type here..."/>
                      <FieldError/>
                    </div>
                    <div className="w-1/7">
                      <Label>Freitag</Label>
                      <InputForm id="tt-fri" placeholder="Type here..."/>
                      <FieldError/>
                    </div>
                    <div className="w-1/7">
                      <Label>Samstag</Label>
                      <InputForm id="tt-sat" placeholder="Type here..."/>
                      <FieldError/>
                    </div>
                    <div className="w-1/7">
                      <Label>Sontag</Label>
                      <InputForm id="tt-sun" placeholder="Type here..."/>
                      <FieldError/>
                    </div>
                  </form.FieldProvider>
                </div>
              )}
            {timetableFormat === 'custom' && (
                <div className="w-1/2">
                  <form.FieldProvider name="timetableCustom">
                    <div>
                      <Label>Timetable</Label>
                      <WysiwygEditorForm/>
                    </div>
                  </form.FieldProvider>
                </div>
            )}
          </div>
        </form.FormProvider>
      </ContentItem>
      <ContentItem stepId="links">
        <form.FormProvider>
          <div className="flex w-full flex-row gap-4">
            <div className="w-1/2">
              <Label>Link für Github Issues</Label>
              <div>
                <form.FieldProvider name="issues">
                  <CreateProjectIssueList/>
                </form.FieldProvider>
              </div>
            </div>
            <div className="w-1/2">
              <Label>Location</Label>
              <form.FieldProvider name="address"
                                  validator={z.string().min(1)}
                                  validatorOptions={{
                                    validateOnChangeIfTouched: true,
                                  }}>
                <InputForm id="address" placeholder="Address..."/>
                <FieldError/>
              </form.FieldProvider>
            </div>
          </div>
          <div className="flex w-full flex-row gap-4">
            <div className="w-full">
              <Label>Links & other Resources</Label>

              <br/> Upload Field oder Link Auswahl
            </div>
          </div>
        </form.FormProvider>
      </ContentItem>
      <ContentItem stepId="review">
        <form.FormProvider>
          <h2 className='font-semibold text-lg'>Übersicht aller Angaben</h2>

          <Label>Projektname</Label>


          <div>
            <form.FieldProvider name="links">
              <CreateProjectLinksList/>
            </form.FieldProvider>
          </div>
          {/* <p>{form._data.v.name || 'Nicht angegeben'}</p> */}

        </form.FormProvider>
      </ContentItem>
    </StepperComponent>
  )
}
