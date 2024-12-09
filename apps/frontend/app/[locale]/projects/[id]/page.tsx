import ImageCarousel from '@/features/projects/components/ImageCarousel'
import { Links } from '@/features/projects/components/Links'
import { Location } from '@/features/projects/components/Location'
import ProjectTitle from '@/features/projects/components/ProjectTitle'
import { SkillScale } from '@/features/projects/components/SkillScale'
import { Text } from '@/features/projects/components/Text'
import TeamMembers from '@/features/projects/components/TeamMembers'
import { Toolbar } from '@/features/projects/components/Toolbar'
import { getProjectItem } from '@/features/projects/projects.queries'

export default async function Projects({
  params,
}: Readonly<{
  params: Promise<{ id: number }>
}>) {
  const id: number = (await params).id
  let project
  try {
    project = await getProjectItem(id)
  } catch (e) {
    console.error(e)
    project = {}
  }

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="max-w-screen-xl w-full p-4 mx-auto flex-col justify-start items-center gap-12 inline-flex">

      {/* //TODO Header */}
      <div className="self-stretch justify-center items-center inline-flex">
        <div className="px-4 py-2 justify-center items-center inline-flex">
          <div className="relative flex-col justify-start items-start flex" />
          <div className="grow shrink basis-0 self-stretch justify-end items-center gap-6 inline-flex">
            <div className="grow shrink basis-0 px-6 flex-col justify-center items-end gap-2.5 inline-flex">
              <div className="relative">
                <div className="left-0 top-0 absolute flex-col justify-start items-start gap-1.5 inline-flex">
                  <div className="justify-start items-start gap-2 inline-flex">
                    <div className="w-[276px] flex-col justify-start items-start gap-1.5 inline-flex">
                      <div className="self-stretch pl-3 pr-14 py-2 rounded-md border border-zinc-300 justify-start items-center inline-flex">
                        <div className="text-zinc-500 text-sm font-medium font-['Inter'] leading-tight">
                          {' '}
                          Search everywhere...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-4 h-4 left-[8px] top-[10px] absolute" />
              </div>
            </div>
            <div className="w-24 h-5 justify-center items-center flex">
              <div className="text-sm font-medium font-['Inter'] leading-tight">
                Find Someone
              </div>
            </div>
            <div className="w-24 h-5 pr-1 justify-start items-center flex">
              <div className="text-sm font-medium font-['Inter'] leading-tight">
                Find a Project
              </div>
            </div>
            <div className="w-[110px] h-5 pr-0.5 justify-center items-center flex">
              <div className="text-sm font-medium font-['Inter'] leading-tight">
                Create a Project
              </div>
            </div>
            <div className="w-[73px] h-5 justify-center items-center flex">
              <div className="text-sm font-medium font-['Inter'] leading-tight">
                Brainstorm
              </div>
            </div>
            <div className='flex h-8 w-8 items-center justify-center'>
              <img className="w-8 h-8 rounded-full" src="https://via.placeholder.com/32x32" alt=""/>
            </div>
          </div>
        </div>
      </div>
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
              <div className='font-medium text-2xl leading-loose'>
                Timetable
              </div>
              <div className="self-stretch h-24 rounded border border-zinc-300 flex-col justify-start items-start flex">
                <div className="self-stretch h-12  justify-start items-start inline-flex">
                  <div
                      className="grow shrink basis-0 self-stretch bg-fuchsia-100 rounded-tl border border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Mon
                    </div>
                  </div>
                  <div
                      className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Tue
                    </div>
                  </div>
                  <div
                      className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Wed
                    </div>
                  </div>
                  <div
                      className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Thu
                    </div>
                  </div>
                  <div
                      className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Fri
                    </div>
                  </div>
                  <div
                      className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Sat
                    </div>
                  </div>
                  <div
                      className="grow shrink basis-0 self-stretch bg-fuchsia-100 rounded-tr border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Son
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-12 justify-start items-start inline-flex">
                  <div className="grow shrink basis-0 self-stretch rounded-bl justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      4pm - 5pm
                    </div>
                  </div>
                  <div
                      className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      -
                    </div>
                  </div>
                  <div
                      className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      -
                    </div>
                  </div>
                  <div
                      className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      4pm - 5pm
                    </div>
                  </div>
                  <div
                      className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      -
                    </div>
                  </div>
                  <div
                      className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      -
                    </div>
                  </div>
                  <div
                      className="grow shrink basis-0 self-stretch rounded-br border-l border-zinc-300 justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      12am - 7pm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='relative mb-16 flex flex-row gap-8'>
            <div className='relative inline-flex w-1/2 flex-col justify-start'>
              Issues
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
      </div>
  )
}
