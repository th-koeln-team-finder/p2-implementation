import type { ProjectSelect, UserInsert } from '@repo/database/schema'

export type PopulatedProject = ProjectSelect & {
  isBookmarked: boolean
  starCount: string

  isStared: boolean
  tags: { tag: { id: string; name: string } }[]
  //  tagSimilarity: number //is this necessary?
}

export type CreateProjectFormBasic = {
  name: string
  description: string
  phase: string
  status: 'open' | 'closed'
  createdBy: string
}

export type CreateProjectFormParticipants = {
  participants: Array<{
    Users: UserInsert
  }>
}

export type CreateProjectFormSkills = {
  skills: Array<{
    label: string
    value: string
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
  address: string
  resources: Array<{
    isDocument: boolean
    label: string
    href: string
    file: File[]
  }>
  tags: { label: string; value: string }[]
}
export type CreateProjectFormPictures = {
  pictures: File[]
}

export type CreateProjectFormValues = CreateProjectFormBasic &
  CreateProjectFormSkills &
  CreateProjectFormParticipants &
  CreateProjectFormTimeTable &
  CreateProjectFormLinks &
  CreateProjectFormPictures

export type CreateApplicationFormValues = {
  firstName: string
  lastName: string
  mail: string
  phone: string
  file: File[]
  message: string
}
