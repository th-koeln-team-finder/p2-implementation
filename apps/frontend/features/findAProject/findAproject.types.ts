import type {
    ProjectSelect,
} from '@repo/database/schema'

export type PopulatedProjects = ProjectSelect & {
  //  isBookmarked: boolean
}
