export enum Weekdays {
    Monday="Monday",
    Tuesday="Tuesday",
    Wednesday="Wednesday",
    Thursday="Thursday",
    Friday="Friday",
    Saturday="Saturday",
    Sunday="Sunday"
}
type WorkTime = { start: number; end: number };
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




export async function ProjectTimetable({
                                            timetable,
                                        }: {
                                           timetable: Timetable;
                                        }
                                        //const data = await getTimetable()
) {
    let m1
    let m2
    let mondayTime = timetable.getWorkTime(Weekdays.Monday)
    if(mondayTime.start!= null)m1=mondayTime.start
    else m1 = "-"
    if(mondayTime.end!= null)m2=mondayTime.end
    else m2 = "-"

    let t1
    let t2
    let tuesdayTime = timetable.getWorkTime(Weekdays.Tuesday)
    if(tuesdayTime.start!= null) t1=tuesdayTime.start
    else t1 = "-"
    if(tuesdayTime.end!= null) t2=tuesdayTime.end
    else t2 = "-"

    let w1
    let w2
    let wednesdayTime = timetable.getWorkTime(Weekdays.Wednesday)
    if(wednesdayTime.start!= null) w1=wednesdayTime.start
    else w1 = "-"
    if(wednesdayTime.end!= null) w2=wednesdayTime.end
    else w2 = "-"

    let th1
    let th2
    let thursdayTime = timetable.getWorkTime(Weekdays.Thursday)
    if(thursdayTime.start!= null) th1=thursdayTime.start
    else th1 = "-"
    if(thursdayTime.end!= null) th2=thursdayTime.end
    else th2 = "-"


    let f1
    let f2
    let fridayTime = timetable.getWorkTime(Weekdays.Friday)
    if(fridayTime.start!= null) f1=fridayTime.start
    else f1 = "-"
    if(fridayTime.end!= null) f2=fridayTime.end
    else f2 = "-"


    let sa1
    let sa2
    let saturdayTime = timetable.getWorkTime(Weekdays.Saturday)
    if(saturdayTime.start!= null) sa1=saturdayTime.start
    else sa1 = "-"
    if(saturdayTime.end!= null) sa2=saturdayTime.end
    else sa2 = "-"


    let su1
    let su2
    let sundayTime = timetable.getWorkTime(Weekdays.Sunday)
    if(sundayTime.start!= null) su1=sundayTime.start
    else su1 = "-"
    if(sundayTime.end!= null) su2=sundayTime.end
    else su2 = "-"


    return(
    <div
        className="self-stretch rounded border border-zinc-300 flex-col justify-start items-start flex">
        <div className="self-stretch h-12 justify-start items-start inline-flex">
            <div
                className="grow shrink basis-0 self-stretch bg-fuchsia-100 rounded-tl border border-zinc-300 justify-center items-center gap-2.5 flex">
                <div
                    className="text-zinc-500 text-sm font-normal leading-tight">Mon
                </div>
            </div>
            <div
                className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                <div
                    className="text-zinc-500 text-sm font-normal leading-tight">Tue
                </div>
            </div>
            <div
                className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                <div
                    className="text-zinc-500 text-sm font-normal leading-tight">Wed
                </div>
            </div>
            <div
                className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                <div
                    className="text-zinc-500 text-sm font-normal leading-tight">Thu
                </div>
            </div>
            <div
                className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                <div
                    className="text-zinc-500 text-sm font-normal leading-tight">Fri
                </div>
            </div>
            <div
                className="grow shrink basis-0 self-stretch bg-fuchsia-100 border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                <div
                    className="text-zinc-500 text-sm font-normal leading-tight">Sat
                </div>
            </div>
            <div
                className="grow shrink basis-0 self-stretch bg-fuchsia-100 rounded-tr border-r border-t border-b border-zinc-300 justify-center items-center gap-2.5 flex">
                <div
                    className="text-zinc-500 text-sm font-normal leading-tight">Son
                </div>
            </div>
        </div>
        <div className="self-stretch h-12 justify-start items-start inline-flex">
            <div
                className="grow shrink basis-0 self-stretch rounded-bl justify-center items-center flex">
                <div
                    className="grow shrink basis-0 text-center text-sm font-normal leading-tight">{ m1} - {m2}
                </div>
            </div>
            <div
                className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                <div
                    className="grow shrink basis-0 text-center text-sm font-normal leading-tight">{t1} - {t2}
                </div>
            </div>
            <div
                className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                <div
                    className="grow shrink basis-0 text-center text-sm font-normal leading-tight">{w1} - {w2}
                </div>
            </div>
            <div
                className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                <div
                    className="grow shrink basis-0 text-center text-sm font-normal leading-tight">{th1} - {th2}
                </div>
            </div>
            <div
                className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                <div
                    className="grow shrink basis-0 text-center text-sm font-normal leading-tight">{f1} - {f2}
                </div>
            </div>
            <div
                className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                <div
                    className="grow shrink basis-0 text-center text-sm font-normal leading-tight">{sa1} - {sa2}
                </div>
            </div>
            <div
                className="grow shrink basis-0 self-stretch rounded-br border-l border-zinc-300 justify-center items-center flex">
                <div
                    className="grow shrink basis-0 text-center text-sm font-normal leading-tight">{su1} - {su2}
                </div>
            </div>
        </div>
    </div>
)
}
