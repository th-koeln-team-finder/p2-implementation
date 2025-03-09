import type { UserWithImage } from '@/features/users/users.types'
import type {
  BrainstormCommentSelect,
  BrainstormResourceSelect,
  BrainstormSelect,
  UploadedFileSelect,
} from '@repo/database/schema'

export type PopulatedBrainstormResource = BrainstormResourceSelect & {
  file?: UploadedFileSelect | null
}

export type PopulatedBrainstorm = Omit<BrainstormSelect, 'embedding'> & {
  isBookmarked: boolean
  creator?: UserWithImage
  tags: { tag: { id: string; name: string } }[]
  resources: PopulatedBrainstormResource[]
  totalSimilarity: number
  similarity: number
  tagSimilarity: number
  commentSimilarity: number
}

export type PopulatedBrainstormComment = BrainstormCommentSelect & {
  likeCount: number
  isLiked: boolean
  brainstorm?: BrainstormSelect
  creator?: UserWithImage
  childComments?: PopulatedBrainstormComment[]
}

export type CreateBrainstormResourceLink = {
  type: 'link'
  label: string
  value: string
}

export type CreateBrainstormResourceFile = {
  type: 'file'
  label: string
  fileValue: File[]
}

export type CreateBrainstormResource =
  | CreateBrainstormResourceLink
  | CreateBrainstormResourceFile

export type CreateBrainstormFormValues = {
  title: string
  description: string
  tags: { label: string; value: string }[]
  resources: CreateBrainstormResource[]
}
