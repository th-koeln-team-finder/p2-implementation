import type { UploadedFileSelect, UserSelect } from '@repo/database/schema'

export type UserWithImage = UserSelect & { image?: UploadedFileSelect | null }
