import {getTranslations} from "next-intl/server";


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

    const weekdays = Object.keys(Weekdays).filter(key => {return isNaN(Number(key))});
    for (let i in weekdays) {
        let timeForDays




    }



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
                        className="grow shrink basis-0 text-center text-sm font-normal leading-tight">****
                    </div>
                </div>
                <div
                    className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div
                        className="grow shrink basis-0 text-center text-sm font-normal leading-tight">****
                    </div>
                </div>
                <div
                    className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div
                        className="grow shrink basis-0 text-center text-sm font-normal leading-tight">****
                    </div>
                </div>
                <div
                    className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div
                        className="grow shrink basis-0 text-center text-sm font-normal leading-tight">****
                    </div>
                </div>
                <div
                    className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div
                        className="grow shrink basis-0 text-center text-sm font-normal leading-tight">****
                    </div>
                </div>
                <div
                    className="grow shrink basis-0 self-stretch border-l border-zinc-300 justify-center items-center flex">
                    <div
                        className="grow shrink basis-0 text-center text-sm font-normal leading-tight">****
                    </div>
                </div>
                <div
                    className="grow shrink basis-0 self-stretch rounded-br border-l border-zinc-300 justify-center items-center flex">
                    <div
                        className="grow shrink basis-0 text-center text-sm font-normal leading-tight">****
                    </div>
                </div>
            </div>
        </div>
    )
}
