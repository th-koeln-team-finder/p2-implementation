import {ProjectInsert, ProjectIssueInsert, ProjectTimetableInsert} from "@/schema";
import {faker} from "@faker-js/faker/locale/de";

export function makeTimetableElement(projectId:number,weekdays: ProjectTimetableInsert["weekdays"][]): ProjectTimetableInsert {
    const selectedWeekday = faker.helpers.arrayElement(weekdays)
    weekdays.splice(weekdays.indexOf(selectedWeekday),1)
    return {
        projectId,
        weekdays: selectedWeekday,
        startTime: faker.date.recent().toString(),
        endTime: faker.date.recent().toString(),
    }
}
export function makeTimetableElements(count: number, projectId:number): ProjectTimetableInsert[] {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as ProjectTimetableInsert["weekdays"][]
    return Array.from({ length: count }, ()=>makeTimetableElement(projectId,weekdays))
}