import {getProjectItem} from '@/features/projects/projects.queries'
import ProjectTitle from "@/features/projects/components/ProjectTitle";
import {ProjectIssuesList} from "@/features/projects/components/ProjectIssuesList";
import {ProjectTimetable, Timetable, Weekdays} from "@/features/projects/components/ProjectTimetable";



export default async function Projects({
                                           params,
                                       }: Readonly<{
    params: Promise<{ id: number }>
}>) {
    const id: number = (await params).id
    const project = await getProjectItem(id)

    const issueList = [
        {title:"Task1",description:"a lot to do",id:1},
        {title:"Task2", description:"still much",id:2},
        {title:"Task3", description:"this is very looooooong, but the Box should remain the same, even though this is a long text, it should only reach to a sertain point",id:3}
    ];
    //issueList should be a related db object and contain a List of Issues

    const timetable = new Timetable([[Weekdays.Monday, 2,5],[Weekdays.Friday,5,7]])
    //timeTable should be a related db object and contain a list of list of day/time tuples

    if (!project) {
        return <div>Project not found</div>
    }

    return (
        <div className="max-w-screen-xl p-4 mx-auto flex-col justify-start items-center gap-12 inline-flex">
            <div className="self-stretch h-20 justify-center items-center inline-flex">
                <div className="h-20 px-4 py-2 justify-center items-center inline-flex">
                    <div className="w-16 h-16 relative flex-col justify-start items-start flex"/>
                    <div className="grow shrink basis-0 self-stretch justify-end items-center gap-6 inline-flex">
                        <div className="grow shrink basis-0 px-6 flex-col justify-center items-end gap-2.5 inline-flex">
                            <div className="w-[276px] h-9 relative">
                                <div
                                    className="left-0 top-0 absolute flex-col justify-start items-start gap-1.5 inline-flex">
                                    <div className="justify-start items-start gap-2 inline-flex">
                                        <div
                                            className="w-[276px] flex-col justify-start items-start gap-1.5 inline-flex">
                                            <div
                                                className="self-stretch pl-3 pr-14 py-2 rounded-md border border-zinc-300 justify-start items-center inline-flex">
                                                <div
                                                    className="text-zinc-500 text-sm font-medium font-['Inter'] leading-tight"> Search
                                                    everywhere...
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-4 h-4 left-[8px] top-[10px] absolute"/>
                            </div>
                        </div>
                        <div className="w-24 h-5 justify-center items-center flex">
                            <div className="text-sm font-medium font-['Inter'] leading-tight">Find
                                Someone
                            </div>
                        </div>
                        <div className="w-24 h-5 pr-1 justify-start items-center flex">
                            <div className="text-sm font-medium font-['Inter'] leading-tight">Find a
                                Project
                            </div>
                        </div>
                        <div className="w-[110px] h-5 pr-0.5 justify-center items-center flex">
                            <div className="text-sm font-medium font-['Inter'] leading-tight">Create a
                                Project
                            </div>
                        </div>
                        <div className="w-[73px] h-5 justify-center items-center flex">
                            <div className="text-sm font-medium font-['Inter'] leading-tight">Brainstorm
                            </div>
                        </div>
                        <div className="w-8 h-8 justify-center items-center flex">
                            <img className="w-8 h-8 rounded-full" src="https://via.placeholder.com/32x32"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="self-stretch h-[1322px] flex-col justify-start items-start gap-8 inline-flex">
                <div className="self-stretch h-[60px] justify-between items-start inline-flex">
                    <ProjectTitle title={project.name} subtitle={project.status} />
                    <div className="justify-end items-center gap-6 flex">
                        <div className="justify-start items-center gap-4 flex">
                            <div className="justify-start items-center gap-2 flex">
                                <div
                                    className="w-[25px] h-4 text-base font-normal leading-normal">13k
                                </div>
                                <div className="w-6 h-6 px-0.5 pt-0.5 pb-[2.98px] justify-center items-center flex"/>
                            </div>
                            <div className="w-6 h-6 relative"/>
                            <div className="w-6 h-6 px-[5px] py-[3px] justify-center items-center flex"/>
                        </div>
                        <div className="h-9 px-4 py-2 bg-fuchsia-700 rounded-md justify-center items-center gap-2 flex">
                            <div className="w-4 h-4 relative"/>
                            <div className="text-fuchsia-50 text-base font-medium leading-tight">Join the
                                team
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[1248px] h-[1230px] relative">
                    <div className="w-[1246px] h-[284px] left-0 top-0 absolute">
                        <div
                            className="w-[608px] h-[195.29px] left-[638px] top-0 absolute flex-col justify-start items-start gap-2 inline-flex">
                            <div
                                className="w-[216px] h-[25px] text-2xl font-medium leading-loose">Skills
                                needed
                            </div>
                            <div className="self-stretch h-[184px] justify-start items-start gap-6 inline-flex">
                                <div
                                    className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                                    <div className="self-stretch justify-between items-center inline-flex">
                                        <div
                                            className="text-base font-normal leading-normal">Java
                                            (Programming Language)
                                        </div>
                                        <div className="h-2.5 py-px justify-center items-center gap-2.5 flex">
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                        </div>
                                    </div>
                                    <div className="self-stretch justify-between items-center inline-flex">
                                        <div
                                            className="text-base font-normal leading-normal">Python
                                            (Programming Language)
                                        </div>
                                        <div className="h-2.5 py-px justify-center items-center gap-2.5 flex">
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                        </div>
                                    </div>
                                    <div className="self-stretch justify-between items-center inline-flex">
                                        <div
                                            className="text-base font-normal leading-normal">Teamwork
                                        </div>
                                        <div className="h-2.5 py-px justify-center items-center gap-2.5 flex">
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                        </div>
                                    </div>
                                    <div className="self-stretch justify-between items-center inline-flex">
                                        <div
                                            className="text-base font-normal leading-normal">Cooking
                                        </div>
                                        <div className="h-2.5 py-px justify-center items-center gap-2.5 flex">
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                        </div>
                                    </div>
                                    <div className="self-stretch justify-between items-center inline-flex">
                                        <div
                                            className="text-base font-normal leading-normal">Cooking
                                        </div>
                                        <div className="h-2.5 py-px justify-center items-center gap-2.5 flex">
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                        </div>
                                    </div>
                                    <div className="self-stretch justify-between items-center inline-flex">
                                        <div
                                            className="text-base font-normal leading-normal">Cooking
                                        </div>
                                        <div className="h-2.5 py-px justify-center items-center gap-2.5 flex">
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                            <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[22px] justify-center items-center inline-flex">
                                <div
                                    className="self-stretch origin-top-left rotate-180 justify-center items-center gap-4 inline-flex">
                                    <div
                                        className="w-[110px] h-[22px] origin-top-left rotate-180 text-fuchsia-700 text-base font-normal leading-normal">Mehr
                                        anzeigen
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="w-[608px] h-[284px] left-0 top-0 absolute flex-col justify-start items-center gap-2 inline-flex">
                            <div className="rounded-lg justify-end items-center inline-flex">
                                <img className="w-[1217px] h-[572px]" src="https://via.placeholder.com/1217x572"/>
                            </div>
                            <div className="w-20 py-px justify-center items-center gap-2.5 inline-flex">
                                <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                                <div className="w-2 h-2 bg-fuchsia-800 rounded-full"/>
                                <div className="w-2 h-2 bg-fuchsia-200 rounded-full"/>
                            </div>
                        </div>
                    </div>
                    <div
                        className="w-[611px] h-48 left-0 top-[1038px] absolute flex-col justify-start items-start gap-2 inline-flex">
                        <div
                            className="w-[279px] h-8 text-2xl font-medium leading-loose">Links
                            & other Resources
                        </div>
                        <div className="self-stretch justify-start items-center gap-2 inline-flex">
                            <div className="w-4 h-4 relative"/>
                            <div
                                className="text-base font-normal underline leading-normal">Homepage
                            </div>
                        </div>
                        <div className="self-stretch justify-start items-center gap-2 inline-flex">
                            <div className="w-4 h-4 relative"/>
                            <div
                                className="text-base font-normal underline leading-normal">Project
                                Requirements
                            </div>
                        </div>
                        <div className="self-stretch justify-start items-center gap-2 inline-flex">
                            <div className="w-4 h-4 relative"/>
                            <div
                                className="text-base font-normal underline leading-normal">List
                                of Features
                            </div>
                        </div>
                        <div className="self-stretch justify-start items-center gap-2 inline-flex">
                            <div className="w-4 h-4 relative"/>
                            <div
                                className="text-base font-normal underline leading-normal">Github
                            </div>
                        </div>
                        <div className="self-stretch justify-start items-center gap-2 inline-flex">
                            <div className="w-4 h-4 relative"/>
                            <div
                                className="text-base font-normal underline leading-normal">Youtube
                            </div>
                        </div>
                    </div>
                    <div
                        className="w-[1248px] left-0 top-[348px] absolute text-base font-normal leading-normal">Jorem
                        ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a,
                        mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut
                        interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class
                        aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent
                        auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse
                        ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam
                        sit amet lacinia. Aliquam in elementum tellus.
                    </div>
                    <div
                        className="w-[1240px] h-[136px] left-0 top-[508px] absolute justify-start items-start gap-6 inline-flex">
                        <div className="h-[136px] justify-start items-center flex">
                            <div
                                className="w-[188px] h-8 text-2xl font-medium leading-loose">Team
                                Members
                            </div>
                            <div className="justify-center items-center flex">
                                <div className="self-stretch justify-start items-start gap-5 flex">
                                    <div className="w-20 flex-col justify-start items-center gap-2 inline-flex">
                                        <div className="rounded-[200px] justify-end items-center inline-flex">
                                            <img className="w-[154px] h-[71px]"
                                                 src="https://via.placeholder.com/154x71"/>
                                        </div>
                                        <div
                                            className="self-stretch text-center text-base font-normal leading-normal">Gina
                                        </div>
                                    </div>
                                    <div className="w-20 h-24 relative">
                                        <div
                                            className="w-20 left-0 top-[72px] absolute text-center text-base font-normal leading-normal">Jonathan
                                        </div>
                                        <div
                                            className="w-16 h-16 left-[5.48px] top-0 absolute rounded-[200px] justify-end items-center inline-flex">
                                            <img className="w-[154px] h-[71px]"
                                                 src="https://via.placeholder.com/154x71"/>
                                        </div>
                                    </div>
                                    <div className="w-[78.75px] h-24 relative">
                                        <div
                                            className="w-[75px] left-[3.75px] top-[72px] absolute text-center text-base font-normal leading-normal">Thomas
                                        </div>
                                        <div
                                            className="w-16 h-16 left-0 top-0 absolute rounded-[200px] justify-end items-center inline-flex">
                                            <img className="w-[154px] h-[71px]"
                                                 src="https://via.placeholder.com/154x71"/>
                                        </div>
                                    </div>
                                    <div className="w-20 flex-col justify-start items-center gap-2 inline-flex">
                                        <div className="rounded-[200px] justify-end items-center inline-flex">
                                            <img className="w-[154px] h-[71px]"
                                                 src="https://via.placeholder.com/154x71"/>
                                        </div>
                                        <div
                                            className="self-stretch text-center text-base font-normal leading-normal">Pauline
                                        </div>
                                    </div>
                                    <div className="w-20 flex-col justify-start items-center gap-2 inline-flex">
                                        <div className="rounded-[200px] justify-end items-center inline-flex">
                                            <img className="w-[154px] h-[71px]"
                                                 src="https://via.placeholder.com/154x71"/>
                                        </div>
                                        <div
                                            className="self-stretch h-6 text-center text-base font-normal leading-normal">Andrea<br/>
                                        </div>
                                    </div>
                                    <div className="w-20 flex-col justify-start items-center gap-2 inline-flex">
                                        <div className="rounded-[200px] justify-end items-center inline-flex">
                                            <img className="w-[154px] h-[71px]"
                                                 src="https://via.placeholder.com/154x71"/>
                                        </div>
                                        <div
                                            className="self-stretch text-center text-base font-normal leading-normal">PalmTree..
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="w-[604px] flex-col justify-start items-start gap-2 inline-flex">
                            <div className="text-2xl font-medium leading-loose">Timetable
                            </div>



                            <ProjectTimetable timetable={timetable}/>


                        </div>


                    </div>
                    <div
                        className="w-[1240px] h-[298px] left-0 top-[708px] absolute justify-start items-start gap-6 inline-flex">



                        <ProjectIssuesList listOfIssues={issueList}/>




                        <div className="w-[605px] flex-col justify-start items-start gap-2 inline-flex">
                            <div className="text-2xl font-medium leading-loose">Location
                            </div>
                            <img className="self-stretch h-[178px]" src="https://via.placeholder.com/605x178"/>
                            <div
                                className="self-stretch text-base font-normal leading-normal">Jorem
                                ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est
                                a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin
                                lacus, ut interdum tellus elit sed risus.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
