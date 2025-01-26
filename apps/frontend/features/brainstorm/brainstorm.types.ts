import type {
  BrainstormCommentSelect,
  BrainstormSelect,
  UserSelect,
} from '@repo/database/schema'

export type PopulatedBrainstorm = BrainstormSelect & {
  isBookmarked: boolean

  tags: { tag: { id: string; name: string } }[]
}

export type PopulatedBrainstormComment = BrainstormCommentSelect & {
  likeCount: number
  isLiked: boolean
  brainstorm?: BrainstormSelect
  creator?: UserSelect
  childComments?: PopulatedBrainstormComment[]
}
