'use server'

import { authMiddleware } from '@/auth'
import { FileUploadCacheTags } from '@/features/file-upload/file-upload.constants'
import { redirect } from '@/features/i18n/routing'
import { Schema, db } from '@repo/database'
import { serverEnv } from '@repo/env'
import { eq } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'
import { revalidateTag } from 'next/cache'
import {
  generatePresignedUrl,
  generatePublicUrl,
  removeFile,
} from './uploadClient'

export async function getPresignedUploadUrl(
  bucketPath: string,
  fileType: string,
  fileSize: number,
) {
  const session = await authMiddleware()
  if (!session?.user?.id) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=AccessDenied',
      locale,
    })
  }

  if (fileSize >= serverEnv.MAX_FILE_SIZE) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=FileTooLarge',
      locale,
    })
  }
  if (!serverEnv.ALLOWED_FILE_TYPES.includes(fileType)) {
    const locale = await getLocale()
    return redirect({
      href: '/error?error=InvalidFileType',
      locale,
    })
  }

  await db.insert(Schema.uploadedFiles).values({
    bucketPath,
    fileType,
    fileSize,
    status: 'pending',
    uploadedById: session.user.id,
  })

  return generatePresignedUrl(bucketPath)
}

export async function removeFileUpload(bucketPath: string) {
  await removeFile(bucketPath)
  await db
    .delete(Schema.uploadedFiles)
    .where(eq(Schema.uploadedFiles.bucketPath, bucketPath))
}

export async function getPublicFileUrl(bucketPath: string) {
  return await generatePublicUrl(bucketPath)
}

export async function confirmFileUpload(bucketPath: string) {
  await db
    .update(Schema.uploadedFiles)
    .set({ status: 'uploaded' })
    .where(eq(Schema.uploadedFiles.bucketPath, bucketPath))
}

export async function revalidateFileUploads() {
  return await revalidateTag(FileUploadCacheTags.base)
}
