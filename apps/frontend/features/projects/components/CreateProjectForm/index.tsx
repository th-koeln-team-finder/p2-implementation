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
import { Button } from '@repo/design-system/components/ui/button'
import { Input, InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import {
  Select,
  SelectContent, SelectForm,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select'
import { useState } from 'react'
import { z } from 'zod'
import {WysiwygEditorForm} from "@repo/design-system/components/WysiwygEditor";
import {CreateProjectSkills} from "@/features/projects/components/CreateProjectForm/CreateProjectSkills";

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
    },
    onSubmit: async (values) => {
      await createProjectWithIssues(values)
    },
  })

  const basicFieldGroup = useFieldGroup(form, ['name', 'phase', 'description', 'skills', 'timetableOutput', 'timetableTable', 'timetableCustom'])

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
          <form.FieldProvider name="skills">
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

            {timetableFormat === 'table' && (
                <div className="flex w-full flex-row gap-4">
                  <form.FieldProvider name="timetableTable">
                    <div className="w-1/7">
                      <Label>Montag</Label>
                      <Input id="tt-mon" placeholder="Type here..."/>
                    </div>
                    <div className="w-1/7">
                      <Label>Dienstag</Label>
                      <Input id="tt-tue" placeholder="Type here..."/>
                    </div>
                    <div className="w-1/7">
                      <Label>Mittwoch</Label>
                      <Input id="tt-wed" placeholder="Type here..."/>
                    </div>
                    <div className="w-1/7">
                      <Label>Donnerstag</Label>
                      <Input id="tt-thu" placeholder="Type here..."/>
                    </div>
                    <div className="w-1/7">
                      <Label>Freitag</Label>
                      <Input id="tt-fri" placeholder="Type here..."/>
                    </div>
                    <div className="w-1/7">
                      <Label>Samstag</Label>
                      <Input id="tt-sat" placeholder="Type here..."/>
                    </div>
                    <div className="w-1/7">
                      <Label>Sontag</Label>
                      <Input id="tt-sun" placeholder="Type here..."/>
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
        <div className="flex w-full flex-row gap-4">
          <div className="w-1/2">
            <Label>Link für Github Issues</Label>
            <Input id="issue-link" placeholder="Type here..."/>
            <div>
              <form.FieldProvider name="issues">
                <CreateProjectIssueList/>
              </form.FieldProvider>
            </div>
          </div>
          <div className="w-1/2">
            <Label>Location</Label>
            <div className="flex justify-between gap-4">
              <Input id="location-lat" placeholder="Latitude..." />
              <Input id="location-long" placeholder="Longitude..." />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row gap-4">
          <div className="w-1/2">
            <Label>Links & other Resources</Label>
            <br /> Genauso wie die Skills erweiterbar und Upload Field oder Link
            Auswahl
            <Input id="links" placeholder="Type here..." />
          </div>
        </div>
      </ContentItem>
      <ContentItem stepId="review">
        <form.FormProvider>
          <h2 className='font-semibold text-lg'>Übersicht aller Angaben</h2>

            <Label>Projektname</Label>
          {/* <p>{form._data.v.name || 'Nicht angegeben'}</p> */}

        </form.FormProvider>
      </ContentItem>
    </StepperComponent>
  )
}
