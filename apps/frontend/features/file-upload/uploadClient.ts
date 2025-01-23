import 'server-only'
import { serverEnv } from '@repo/env'
import { Client } from 'minio'

const minioClient = new Client({
  endPoint: serverEnv.MINIO_HOST,
  port: serverEnv.MINIO_PORT,
  useSSL: false,
  accessKey: serverEnv.MINIO_ACCESS_KEY,
  secretKey: serverEnv.MINIO_SECRET_KEY,
})

const bucket = serverEnv.MINIO_BUCKET

export async function generatePresignedUrl(bucketPath: string) {
  // 30 minute presigned URL
  const presignedUrl = await minioClient.presignedPutObject(
    bucket,
    bucketPath,
    60 * 30,
  )
  return presignedUrl.replace(
    `http://${serverEnv.MINIO_HOST}:${serverEnv.MINIO_PORT}`,
    `https://${serverEnv.MINIO_PUBLIC_HOST}/_upload`,
  )
}

export async function generatePublicUrl(bucketPath: string) {
  const presignedUrl = await minioClient.presignedGetObject(bucket, bucketPath)
  return [
    presignedUrl,
    presignedUrl.replace(
      `http://${serverEnv.MINIO_HOST}:${serverEnv.MINIO_PORT}`,
      `https://${serverEnv.MINIO_PUBLIC_HOST}/_upload`,
    ),
  ] as const
}

export async function removeFile(bucketPath: string) {
  return await minioClient.removeObject(bucket, bucketPath)
}
