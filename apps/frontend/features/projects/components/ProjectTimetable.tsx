// biome-ignore lint/nursery/noEnum: <explanation>
export enum Weekdays {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}
//Type for all Timetables
export type Timetable = {
  id: number
  projectId: number
  weekdays:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday'
  startTime: string
  endTime: string
}

export async function ProjectTimetable({
  timetable,
}: {
  timetable: Timetable[]
}) {
  const _weekdays = Object.keys(Weekdays).filter((key) => {
    return Number.isNaN(Number(key))
  })

  const timeoutput: [Weekdays, string][] = [
    [Weekdays.Monday, ' - '],
    [Weekdays.Tuesday, ' - '],
    [Weekdays.Wednesday, ' - '],
    [Weekdays.Thursday, ' - '],
    [Weekdays.Friday, ' - '],
    [Weekdays.Saturday, ' - '],
    [Weekdays.Sunday, ' - '],
  ]

  timetable.map((item) => {
    const i = timeoutput.findIndex(([day]) => day === item.weekdays)
    if (i !== -1) {
      // set the meeting time for the day
      timeoutput[i][1] = `${item.startTime} - ${item.endTime}`
    }
  })

  /*
    if(timetable.filter((item) => item.weekdays === Weekdays.Monday)){
        monday=
    }
*/

  return (
    <div className="flex flex-col items-start justify-start self-stretch rounded border border-zinc-300">
      <div className="inline-flex h-12 items-start justify-start self-stretch">
        <div className="flex shrink grow basis-0 items-center justify-center gap-2.5 self-stretch rounded-tl border border-zinc-300 bg-fuchsia-100">
          <div className="font-normal text-sm text-zinc-500 leading-tight">
            Mon
          </div>
        </div>
        <div className="flex shrink grow basis-0 items-center justify-center gap-2.5 self-stretch border-zinc-300 border-t border-r border-b bg-fuchsia-100">
          <div className="font-normal text-sm text-zinc-500 leading-tight">
            Tue
          </div>
        </div>
        <div className="flex shrink grow basis-0 items-center justify-center gap-2.5 self-stretch border-zinc-300 border-t border-r border-b bg-fuchsia-100">
          <div className="font-normal text-sm text-zinc-500 leading-tight">
            Wed
          </div>
        </div>
        <div className="flex shrink grow basis-0 items-center justify-center gap-2.5 self-stretch border-zinc-300 border-t border-r border-b bg-fuchsia-100">
          <div className="font-normal text-sm text-zinc-500 leading-tight">
            Thu
          </div>
        </div>
        <div className="flex shrink grow basis-0 items-center justify-center gap-2.5 self-stretch border-zinc-300 border-t border-r border-b bg-fuchsia-100">
          <div className="font-normal text-sm text-zinc-500 leading-tight">
            Fri
          </div>
        </div>
        <div className="flex shrink grow basis-0 items-center justify-center gap-2.5 self-stretch border-zinc-300 border-t border-r border-b bg-fuchsia-100">
          <div className="font-normal text-sm text-zinc-500 leading-tight">
            Sat
          </div>
        </div>
        <div className="flex shrink grow basis-0 items-center justify-center gap-2.5 self-stretch rounded-tr border-zinc-300 border-t border-r border-b bg-fuchsia-100">
          <div className="font-normal text-sm text-zinc-500 leading-tight">
            Son
          </div>
        </div>
      </div>
      <div className="inline-flex h-12 items-start justify-start self-stretch">
        <div className="flex shrink grow basis-0 items-center justify-center self-stretch rounded-bl">
          <div className="shrink grow basis-0 text-center font-normal text-sm leading-tight">
            {timeoutput[0][1]}
          </div>
        </div>
        <div className="flex shrink grow basis-0 items-center justify-center self-stretch border-zinc-300 border-l">
          <div className="shrink grow basis-0 text-center font-normal text-sm leading-tight">
            {timeoutput[1][1]}
          </div>
        </div>
        <div className="flex shrink grow basis-0 items-center justify-center self-stretch border-zinc-300 border-l">
          <div className="shrink grow basis-0 text-center font-normal text-sm leading-tight">
            {timeoutput[2][1]}
          </div>
        </div>
        <div className="flex shrink grow basis-0 items-center justify-center self-stretch border-zinc-300 border-l">
          <div className="shrink grow basis-0 text-center font-normal text-sm leading-tight">
            {timeoutput[3][1]}
          </div>
        </div>
        <div className="flex shrink grow basis-0 items-center justify-center self-stretch border-zinc-300 border-l">
          <div className="shrink grow basis-0 text-center font-normal text-sm leading-tight">
            {timeoutput[4][1]}
          </div>
        </div>
        <div className="flex shrink grow basis-0 items-center justify-center self-stretch border-zinc-300 border-l">
          <div className="shrink grow basis-0 text-center font-normal text-sm leading-tight">
            {timeoutput[5][1]}
          </div>
        </div>
        <div className="flex shrink grow basis-0 items-center justify-center self-stretch rounded-br border-zinc-300 border-l">
          <div className="shrink grow basis-0 text-center font-normal text-sm leading-tight">
            {timeoutput[6][1]}
          </div>
        </div>
      </div>
    </div>
  )
}
