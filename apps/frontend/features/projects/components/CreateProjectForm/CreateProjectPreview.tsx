import ImageCarousel from '@/features/projects/components/ImageCarousel'
import { Links } from '@/features/projects/components/Links'
import { Location } from '@/features/projects/components/Location'
import { ProjectIssuesList } from '@/features/projects/components/ProjectIssuesList'
import { ProjectTimetable } from '@/features/projects/components/ProjectTimetable'
import ProjectTitle from '@/features/projects/components/ProjectTitle'
import { SkillScale } from '@/features/projects/components/SkillScale'
import TeamMembers from '@/features/projects/components/TeamMembers'
import { Text } from '@/features/projects/components/Text'
import { Toolbar } from '@/features/projects/components/Toolbar'
import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { useFormContext } from '@formsignals/form-react'
import { useSignals } from '@preact/signals-react/runtime'
import { Weekdays } from '@repo/database/schema'

function extractTextFromDescription(desc: string) {
  const parsedDescription = JSON.parse(desc) // JSON-String in Objekt umwandeln
  let extractedText = ''

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const traverseNodes = (nodes: any) => {
    for (const node of nodes) {
      if (node.type === 'text' && node.text) {
        extractedText += node.text
      }
      if (node.children) {
        traverseNodes(node.children)
      }
    }
  }

  if (parsedDescription.root?.children) {
    traverseNodes(parsedDescription.root.children)
  }

  return extractedText
}

export function CreateProjectPreview() {
  useSignals()
  const form = useFormContext<CreateProjectFormValues>()
  const formValues = form.json.value

  console.log(formValues.ressources)
  console.log(formValues.timetableCustom)

  const timetabledata: { description: string; weekdays: string }[] = [
    { description: formValues.ttMon, weekdays: Weekdays.monday.toString() },
    { description: formValues.ttTue, weekdays: Weekdays.tuesday.toString() },
    { description: formValues.ttWed, weekdays: Weekdays.wednesday.toString() },
    { description: formValues.ttThu, weekdays: Weekdays.thursday.toString() },
    { description: formValues.ttFri, weekdays: Weekdays.friday.toString() },
    { description: formValues.ttSat, weekdays: Weekdays.saturday.toString() },
    { description: formValues.ttSun, weekdays: Weekdays.sunday.toString() },
  ]

  const timetable = timetabledata.map((entry) => {
    if (entry.description !== undefined || entry.description !== '')
      return entry
  })

  return (
    <div className="w-full rounded-lg p-4 shadow lg:p-8">
      <div className="mx-auto inline-flex w-full max-w-screen-xl flex-col items-center justify-start gap-12 lg:p-4">
        <div className="inline-flex flex-col items-start justify-start gap-8 self-stretch">
          <div className="inline-flex items-start justify-between self-stretch">
            <ProjectTitle
              title={formValues.name}
              subtitle={formValues.status}
            />
            {/*<p>{formValues.phase}</p>*/}
            <Toolbar />
          </div>
          <div className="relative w-full">
            <div className="relative mb-16 flex flex-col gap-8 lg:flex-row">
              <div className="relative inline-flex w-full flex-col items-center justify-start gap-2 lg:w-1/2">
                <ImageCarousel />
              </div>
              <div className="relative inline-flex w-full flex-col items-start justify-start gap-2 lg:w-1/2">
                <SkillScale projectSkills={formValues.skills} />
              </div>
            </div>

            <div className="relative mb-16 flex flex-col gap-8 lg:flex-row">
              <Text
                description={extractTextFromDescription(formValues.description)}
              />
            </div>

            <div className="relative mb-16 flex flex-col gap-8 lg:flex-row">
              <div className="relative inline-flex w-full flex-col justify-start gap-2 lg:w-1/2">
                <TeamMembers />
              </div>
              <div className="relative inline-flex w-full flex-col items-start justify-start gap-2 lg:w-1/2">
                <ProjectTimetable timetable={timetable} />
                {/*<p>{extractTextFromDescription(formValues.timetableCustom)}</p>*/}
              </div>
            </div>

            <div className="relative mb-16 flex flex-col gap-8 lg:flex-row">
              <div className="relative inline-flex w-full flex-col justify-start lg:w-1/2">
                <ProjectIssuesList listOfIssues={formValues.issues} />
              </div>
              <div className="relative inline-flex w-full flex-col justify-start lg:w-1/2">
                {/*<Location
                                  location={formValues.address}
                              />*/}
                <Location
                  location={{
                    latitude: 51.023197847815915,
                    longitude: 7.56205608469124,
                  }}
                />
              </div>
            </div>

            <div className="relative mb-16 flex flex-col gap-8 lg:flex-row">
              <div className="relative inline-flex w-full flex-col justify-start lg:w-1/2">
                <Links links={formValues.ressources} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p>{formValues.address}</p>
    </div>
  )
}
