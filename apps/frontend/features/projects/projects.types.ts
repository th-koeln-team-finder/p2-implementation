export type CreateProjectFormBasic = {
  name: string
  description: string
  phase: string
  status: 'open' | 'closed'
}

export type CreateProjectFormSkills = {
  skills: Array<{
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    skillId: any
    name: string
    level: number
  }>
}

export type CreateProjectFormTime = {
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
  ressources: Array<{
    label: string
    isDocument: boolean
    href: string
    file: string
  }>
}

export type CreateProjectFormValues = CreateProjectFormBasic &
  CreateProjectFormSkills &
  CreateProjectFormTime &
  CreateProjectFormLinks
