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

//checks, if data ist a Timetable
export function isTimetable(data: unknown): data is Timetable[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        item &&
        typeof item.id === 'number' &&
        typeof item.projectId === 'number' &&
        typeof item.weekdays === 'string' &&
        [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ].includes(item.weekdays) &&
        typeof item.startTime === 'string' &&
        typeof item.endTime === 'string',
    )
  )
}

/*
export class Timetable {

    private timetable:  Record<Weekdays, WorkTime | null>;

     public constructor(timetable: [Weekdays,number,number][]) {

         this.timetable = {
             [Weekdays.Monday]: null,
             [Weekdays.Tuesday]: null,
             [Weekdays.Wednesday]: null,
             [Weekdays.Thursday]: null,
             [Weekdays.Friday]: null,
             [Weekdays.Saturday]: null,
             [Weekdays.Sunday]: null,
         };
         timetable.forEach(([weekday, start, end]) => {
             this.setWorkTime(weekday, start, end);
         });
     }
     public getObject(){
        return this.timetable
     }

    public getWorkTime(day: Weekdays): WorkTime | null {
        return this.timetable[day];
    }

    public setWorkTime(day: Weekdays, start: number, end: number) {
         if(start==null||end==null)
        if (start >= end) {

            //DO WE THROW ERRORS?
            throw new Error(`Invalid time range for ${day}: start must be before end.`);
        }
        this.timetable[day] = { start, end };

    }

    public removeWorkTime(day: Weekdays) {
        this.timetable[day] = null;
    }

}
*/

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

  timetable.forEach((item) => {
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
