import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { useFormContext } from '@formsignals/form-react'
import { useSignals } from '@preact/signals-react/runtime'
import ProjectTitle from "@/features/projects/components/ProjectTitle";
import {Toolbar} from "@/features/projects/components/Toolbar";
import ImageCarousel from "@/features/projects/components/ImageCarousel";
import {SkillScale} from "@/features/projects/components/SkillScale";
import {Text} from "@/features/projects/components/Text";
import TeamMembers from "@/features/projects/components/TeamMembers";
import {ProjectTimetable} from "@/features/projects/components/ProjectTimetable";
import {ProjectIssuesList} from "@/features/projects/components/ProjectIssuesList";
import {Location} from "@/features/projects/components/Location";
import {Links} from "@/features/projects/components/Links";

function extractTextFromDescription(desc: string) {
    const parsedDescription = JSON.parse(desc); // JSON-String in Objekt umwandeln
    let extractedText = "";

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const traverseNodes = (nodes: any) => {
        for (const node of nodes) {
            if (node.type === "text" && node.text) {
                extractedText += node.text;
            }
            if (node.children) {
                traverseNodes(node.children);
            }
        }
    };

    if (parsedDescription.root?.children) {
        traverseNodes(parsedDescription.root.children);
    }

    return extractedText;
}


export function CreateProjectPreview() {
  useSignals()
  const form = useFormContext<CreateProjectFormValues>()
  const formValues = form.json.value

  console.log(formValues.issues)

  return (
      <div className='w-full rounded-lg p-8 shadow'>
          <div className="mx-auto inline-flex w-full max-w-screen-xl flex-col items-center justify-start gap-12 p-4">
              <div className="inline-flex flex-col items-start justify-start gap-8 self-stretch">
                  <div className="inline-flex items-start justify-between self-stretch">
                      <ProjectTitle title={formValues.name} subtitle={formValues.status}/>
                      <p>{formValues.phase}</p>
                      {/*<Toolbar/>*/}
                  </div>
                  <div className="relative w-full">
                      <div className="relative mb-16 flex flex-row gap-8">
                          <div className="relative inline-flex w-1/2 flex-col items-center justify-start gap-2">
                              <ImageCarousel/>
                          </div>
                          <div className="relative inline-flex w-1/2 flex-col items-start justify-start gap-2">
                              <SkillScale projectSkills={formValues.skills}/>
                          </div>
                      </div>

                      <div className="relative mb-16 flex flex-row gap-8">
                          <Text description={extractTextFromDescription(formValues.description)}/>
                      </div>

                      <div className="relative mb-16 flex flex-row gap-8">
                          <div className="relative inline-flex w-1/2 flex-col justify-start gap-2">
                              {/*<TeamMembers/>*/}
                          </div>
                          <div className="relative inline-flex w-1/2 flex-col items-start justify-start gap-2">
                              {/*<ProjectTimetable timetable={formValues.timetable}/>*/}
                              <p>{extractTextFromDescription(formValues.timetableCustom)}</p>
                          </div>
                      </div>
                  </div>

                  <div className="relative mb-16 flex flex-row gap-8">
                      <div className="relative inline-flex w-1/2 flex-col justify-start">
                          <ProjectIssuesList listOfIssues={formValues.issues}/>
                      </div>
                      <div className="relative inline-flex w-1/2 flex-col justify-start">
                          {/*<Location
                              location={formValues.address}
                          />*/}
                      </div>
                  </div>

                  <div className="relative mb-16 flex flex-row gap-8">
                      <div className="relative inline-flex w-1/2 flex-col justify-start">
                          {/*<Links links={formValues.ressources}/>
                          <Links
                              links={[
                                  {
                                      label: 'Download Project Brief',
                                      href: 'https://via.placeholder.com/32x32',
                                      isDocument: true,
                                  },
                                  {
                                      label: 'Download Project Brief',
                                      href: 'https://via.placeholder.com/32x32',
                                      isDocument: false,
                                  },
                              ]}
                          />*/}
                      </div>
                  </div>
              </div>
          </div>



          <p>Monday: {formValues.ttMon}</p>
          <p>Tuesday: {formValues.ttTue}</p>
          <p>Wednesday: {formValues.ttWed}</p>
          <p>Tuesday: {formValues.ttThu}</p>
          <p>Friday: {formValues.ttFri}</p>
          <p>Saturday: {formValues.ttSat}</p>
          <p>Sunday: {formValues.ttSun}</p>
          {formValues.issues.map((issue, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: index as key
              <div key={`issue-${index}`}>
                  <p>{issue.title}</p>
                  <p>{issue.description}</p>
              </div>
          ))}
          <p>{formValues.address}</p>
          {formValues.ressources.map((ressource, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: index as key
              <div key={`ressource-${index}`}>
                  <p>{ressource.url}</p>
                  <p>{ressource.file}</p>
              </div>
          ))}
      </div>
  )
}
