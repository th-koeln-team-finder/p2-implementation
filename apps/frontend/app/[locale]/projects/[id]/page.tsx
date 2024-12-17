import { Links } from '@/features/projects/components/Links'
import { Location } from '@/features/projects/components/Location'
import ProjectTitle from '@/features/projects/components/ProjectTitle'
import { SkillScale } from '@/features/projects/components/SkillScale'
import { Text } from '@/features/projects/components/Text'
import TeamMembers from '@/features/projects/components/TeamMembers'
import { Toolbar } from '@/features/projects/components/Toolbar'
import {
    getProjectIssueList,
    getProjectItem, getProjectSkills,
    getProjectTimetable,
} from '@/features/projects/projects.queries'
import ImageCarousel from "@/features/projects/components/ImageCarousel";
import {ProjectTimetable} from "@/features/projects/components/ProjectTimetable";
import {ProjectIssuesList} from "@/features/projects/components/ProjectIssuesList";
import {ProjectIssueSelect, ProjectTimetableSelect} from "@repo/database/schema";


export default async function Projects({
  params,
}: Readonly<{
  params: Promise<{ id: number }>
}>) {
  const id: number = (await params).id
  let project
  let issues
  let timetable
  let skills

  try {
    project = await getProjectItem(id)
    //issues = await getProjectIssueList(id)
    //timetable = await getProjectTimetable(id)
    //skills = await getProjectSkills(id)
  } catch (e) {
    console.error(e)
    project = {}
  }

  if (!project) {
    return <div>Project not found</div>
  }
  let TimetableData:ProjectTimetableSelect[]=[]
  let issuesData: ProjectIssueSelect[]=[]
/*
  if (isTimetable(timetable)){
  TimetableData=timetable
  }
  if (Array.isArray(issues)){
        issuesData=issues
  }
*/




  return (
    <div className="max-w-screen-xl w-full p-4 mx-auto flex-col justify-start items-center gap-12 inline-flex">

      <div className='inline-flex flex-col items-start justify-start gap-8 self-stretch'>
        <div className='inline-flex items-start justify-between self-stretch'>
          <ProjectTitle title={project.name} subtitle={project.status}/>
          <Toolbar/>
        </div>
        <div className="relative w-full">
          <div className='relative mb-16 flex flex-row gap-8'>
            <div className='relative inline-flex w-1/2 flex-col items-center justify-start gap-2'>
              <ImageCarousel/>
            </div>
            <div className='relative inline-flex w-1/2 flex-col items-start justify-start gap-2'>
              {//TODO Skill Daten übergeben - Entität für Skills erstellen
              }
              <SkillScale skills={[{name: "Java (Programming Language)", level: 4},
                {name: "Python (Programming Language)", level: 3},
                {name: "Teamwork", level: 5},
                {name: "Cooking", level: 2},
                {name: "React", level: 1},
                {name: "German", level: 4},
                {name: "Dancing", level: 3},
                {name: "TypeScript (Programming Language)", level: 3}]}/>
            </div>
          </div>


          <div className='relative mb-16 flex flex-row gap-8'>
            <Text description={project.description}/>
          </div>

            <div className='relative mb-16 flex flex-row gap-8'>
                <div className='relative inline-flex w-1/2 flex-col justify-start gap-2'>
                    <TeamMembers/>
                </div>
                <div className='relative inline-flex w-1/2 flex-col items-start justify-start gap-2'>
                        <ProjectTimetable timetable={TimetableData}/>
                </div>
            </div>
        </div>

          <div className='relative mb-16 flex flex-row gap-8'>
              <div className='relative inline-flex w-1/2 flex-col justify-start'>
                  <ProjectIssuesList listOfIssues={issuesData}/>
              </div>
              <div className='relative inline-flex w-1/2 flex-col justify-start'>
                  <Location
                      location={{
                          latitude: 51.023197847815915,
                          longitude: 7.56205608469124,
                      }}
                  />
              </div>
          </div>

            <div className='relative mb-16 flex flex-row gap-8'>
              <div className='relative inline-flex w-1/2 flex-col justify-start'>
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
                />
              </div>
            </div>

          </div>
        </div>

  )
}
