'use server'

import { FileUploadCacheTags } from '@/features/file-upload/file-upload.constants'
import { Schema, db } from '@repo/database'
import { eq } from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getAllFileUploadsForUser = cache(
  async (userId: string) => {
    return db.query.uploadedFiles.findMany({
      where: eq(Schema.uploadedFiles.uploadedById, userId),
    })
  },
  ['getAllFileUploadsForUser'],
  { tags: [FileUploadCacheTags.base] },
)

export const getUploadedFileByPath = cache(
  async (bucketPath: string) => {
    return db.query.uploadedFiles.findFirst({
      where: eq(Schema.uploadedFiles.bucketPath, bucketPath),
    })
  },
  ['getUploadedFileByPath'],
  { tags: [FileUploadCacheTags.base] },
)
