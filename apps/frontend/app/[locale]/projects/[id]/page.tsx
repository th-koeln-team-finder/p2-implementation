import ImageCarousel from '@/features/projects/components/ImageCarousel'
import { Links } from '@/features/projects/components/Links'
import { Location } from '@/features/projects/components/Location'
import ProjectTitle from '@/features/projects/components/ProjectTitle'
import { SkillScale } from '@/features/projects/components/SkillScale'
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
            <div className="w-8 h-8 justify-center items-center flex">
              <img className="w-8 h-8 rounded-full" src="https://via.placeholder.com/32x32"/>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch flex-col justify-start items-start gap-8 inline-flex">
        <div className="self-stretch justify-between items-start inline-flex">
          <ProjectTitle title={project.name} subtitle={project.status} />
          <Toolbar />
        </div>
        <div className="relative w-full">
          <div className="relative flex flex-row gap-8 mb-16">
            <div className="w-1/2 relative flex-col justify-start items-center gap-2 inline-flex">
              <ImageCarousel />
            </div>
            <div className="w-1/2 relative flex-col justify-start items-start gap-2 inline-flex">
              {//TODO Skill Daten übergeben - Entität für Skills erstellen
                 }
              <SkillScale skills={[ {name: "Java (Programming Language)", level: 4},
                {name: "Python (Programming Language)", level: 3},
                {name: "Teamwork", level: 5},
                {name:"Cooking", level: 2},
                {name: "React", level: 1},
                {name: "German", level: 4},
                {name: "Dancing", level: 3},
                {name: "TypeScript (Programming Language)", level: 3} ]}/>
            </div>
          </div>
          <div className="relative flex flex-row gap-8 mb-16">
            <div className="w-1/2 relative flex-col justify-start gap-2 inline-flex">
              <TeamMembers />
            </div>
            <div className="w-1/2 relative flex-col justify-start items-start gap-2 inline-flex">
              <div className="text-2xl font-medium leading-loose">
                Timetable
              </div>
              <div className="self-stretch h-24 rounded border border-zinc-300 flex-col justify-start items-start flex">
                <div className="self-stretch h-12  justify-start items-start inline-flex">
                  <div className="grow shrink basis-0 self-stretch bg-fuchsia-100 rounded-tl border border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Mon
                    </div>
                  </div>
                  <div className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Tue
                    </div>
                  </div>
                  <div className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Wed
                    </div>
                  </div>
                  <div className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Thu
                    </div>
                  </div>
                  <div className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Fri
                    </div>
                  </div>
                  <div className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                    <div className="text-zinc-500 text-sm font-normal leading-tight">
                      Sat
                    </div>
                  </div>
                  <div className="grow shrink basis-0 self-stretch bg-fuchsia-100 rounded-tr border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
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
                  <div className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      -
                    </div>
                  </div>
                  <div className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      -
                    </div>
                  </div>
                  <div className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      4pm - 5pm
                    </div>
                  </div>
                  <div className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      -
                    </div>
                  </div>
                  <div className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      -
                    </div>
                  </div>
                  <div className="grow shrink basis-0 self-stretch rounded-br border-l border-zinc-300 justify-center items-center flex">
                    <div className="grow shrink basis-0 text-center text-sm font-normal leading-tight">
                      12am - 7pm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*
          <div className="w-[1248px] left-0 top-[348px] absolute text-base font-normal leading-normal">
            Jorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus
            nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum
            tellus elit sed risus. Maecenas eget condimentum velit, sit amet
            feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
            conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus
            enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
            Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
            lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
            elementum tellus.
          </div>
          <div className="w-[1240px] h-[136px] left-0 top-[508px] absolute justify-start items-start gap-6 inline-flex">
            <div className="h-[136px] justify-start items-center flex">
              <div className="w-[188px] h-8 text-2xl font-medium leading-loose">
                Team Members
              </div>
              <div className="justify-center items-center flex">
                <div className="self-stretch justify-start items-start gap-5 flex">
                  <div className="w-20 flex-col justify-start items-center gap-2 inline-flex">
                    <div className="rounded-[200px] justify-end items-center inline-flex">
                      <img
                          className="w-[154px] h-[71px]"
                          src="https://via.placeholder.com/154x71"
                      />
                    </div>
                    <div className="self-stretch text-center text-base font-normal leading-normal">
                      Gina
                    </div>
                  </div>
                  <div className="w-20 h-24 relative">
                    <div className="w-20 left-0 top-[72px] absolute text-center text-base font-normal leading-normal">
                      Jonathan
                    </div>
                    <div
                        className="w-16 h-16 left-[5.48px] top-0 absolute rounded-[200px] justify-end items-center inline-flex">
                      <img
                          className="w-[154px] h-[71px]"
                          src="https://via.placeholder.com/154x71"
                      />
                    </div>
                  </div>
                  <div className="w-[78.75px] h-24 relative">
                    <div
                        className="w-[75px] left-[3.75px] top-[72px] absolute text-center text-base font-normal leading-normal">
                      Thomas
                    </div>
                    <div
                        className="w-16 h-16 left-0 top-0 absolute rounded-[200px] justify-end items-center inline-flex">
                      <img
                          className="w-[154px] h-[71px]"
                          src="https://via.placeholder.com/154x71"
                      />
                    </div>
                  </div>
                  <div className="w-20 flex-col justify-start items-center gap-2 inline-flex">
                    <div className="rounded-[200px] justify-end items-center inline-flex">
                      <img
                          className="w-[154px] h-[71px]"
                          src="https://via.placeholder.com/154x71"
                      />
                    </div>
                    <div className="self-stretch text-center text-base font-normal leading-normal">
                      Pauline
                    </div>
                  </div>
                  <div className="w-20 flex-col justify-start items-center gap-2 inline-flex">
                    <div className="rounded-[200px] justify-end items-center inline-flex">
                      <img
                          className="w-[154px] h-[71px]"
                          src="https://via.placeholder.com/154x71"
                      />
                    </div>
                    <div className="self-stretch h-6 text-center text-base font-normal leading-normal">
                      Andrea
                      <br/>
                    </div>
                  </div>
                  <div className="w-20 flex-col justify-start items-center gap-2 inline-flex">
                    <div className="rounded-[200px] justify-end items-center inline-flex">
                      <img
                          className="w-[154px] h-[71px]"
                          src="https://via.placeholder.com/154x71"
                      />
                    </div>
                    <div className="self-stretch text-center text-base font-normal leading-normal">
                      PalmTree..
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[604px] flex-col justify-start items-start gap-2 inline-flex">
              <div className="text-2xl font-medium leading-loose">
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
          */}
          <div className="relative flex flex-row gap-8 mb-16">
            {/*<div className="w-[611px] h-[265px] flex-col justify-start items-start gap-4 inline-flex">
              <div className="self-stretch h-[25px] text-2xl font-medium leading-loose">
                Open issues for starters
              </div>
              <div className="self-stretch h-56 flex-col justify-start items-start gap-4 flex">
                <div
                    className="self-stretch h-16 p-2  rounded border border-zinc-300 flex-col justify-start items-start flex">
                  <div className="self-stretch justify-between items-center inline-flex">
                    <div className="text-base font-medium leading-7">
                      Change Title Page
                    </div>
                    <div className="text-fuchsia-700 text-xs font-medium font-['Inter'] leading-tight">
                      #1566
                    </div>
                  </div>
                  <div className="text-xs font-medium font-['Inter'] leading-tight">
                    Update the text on the title page to “Great being here”
                  </div>
                </div>
                <div
                    className="self-stretch h-16 p-2 rounded border border-zinc-300 flex-col justify-start items-start flex">
                  <div className="self-stretch justify-between items-center inline-flex">
                    <div className="text-base font-medium leading-7">
                      Change Title Page
                    </div>
                    <div className="text-fuchsia-700 text-xs font-medium font-['Inter'] leading-tight">
                      #1566
                    </div>
                  </div>
                  <div className="text-xs font-medium font-['Inter'] leading-tight">
                    Update the text on the title page to “Great being here”
                  </div>
                </div>
                <div
                    className="self-stretch h-16 p-2 rounded border border-zinc-300 flex-col justify-start items-start flex">
                  <div className="self-stretch justify-between items-center inline-flex">
                    <div className="text-base font-medium leading-7">
                      Change Title Page
                    </div>
                    <div className="text-fuchsia-700 text-xs font-medium font-['Inter'] leading-tight">
                      #1566
                    </div>
                  </div>
                  <div className="text-xs font-medium font-['Inter'] leading-tight">
                    Update the text on the title page to “Great being here”
                  </div>
                </div>
              </div>
            </div> */}
            <Location
              location={{
                latitude: 51.023197847815915,
                longitude: 7.56205608469124,
              }}
            />
          </div>
        </div>

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
  )
}
