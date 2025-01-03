import type {
  BrainstormCommentSelect,
  BrainstormSelect,
  UserSelect,
} from '@repo/database/schema'

export type PopulatedBrainstormComment = BrainstormCommentSelect & {
  brainstorm?: BrainstormSelect
  creator?: UserSelect
  childComments?: PopulatedBrainstormComment[]
  likes: Array<{
    userId: string
  }>
}
