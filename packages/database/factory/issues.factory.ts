import type { ProjectIssueInsert } from '@/schema'
import { faker } from '@faker-js/faker/locale/de'

export function makeIssue(projectId: string): ProjectIssueInsert {
  return {
    projectId,
    title: faker.internet.username(),
    description: faker.lorem.lines({ min: 1, max: 4 }),
  }
}
export function makeIssues(
  count: number,
  projectId: string,
): ProjectIssueInsert[] {
  return Array.from({ length: count }, () => makeIssue(projectId))
}
