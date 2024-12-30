import {ProjectInsert, ProjectIssueInsert} from "@/schema";
import {faker} from "@faker-js/faker/locale/de";

export function makeIssue(projectId:number): ProjectIssueInsert {
    return {
        projectId,
        title: faker.internet.username(),
        description: faker.lorem.sentence(),
    }
}
export function makeIssues(count: number, projectId:number): ProjectIssueInsert[] {
    return Array.from({ length: count }, ()=>makeIssue(projectId))
}