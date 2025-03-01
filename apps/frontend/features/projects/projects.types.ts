import type { ProjectSelect } from '@repo/database/schema'

export type PopulatedProjects = ProjectSelect & {
  //  isBookmarked: boolean
}

export type CreateProjectFormBasic = {
  name: string
  description: string
  phase: string
  status: 'open' | 'closed'
}

export type CreateProjectFormSkills = {
  skills: Array<{
    name: string
    level: number
  }>
}

export type CreateProjectFormTimeTable = {
  timetableOutput: string
  ttMon: string
  ttTue: string
  ttWed: string
  ttThu: string
  ttFri: string
  ttSat: string
  ttSun: string
  timetableCustom: string
}

export type CreateProjectFormLinks = {
  issues: Array<{
    title: string
    description: string
  }>
  resources: Array<{
    isDocument: boolean
    label: string
    href: string
    file: File[]
  }>
}

export type CreateProjectFormValues = CreateProjectFormBasic &
  CreateProjectFormSkills &
  CreateProjectFormTimeTable &
  CreateProjectFormLinks
