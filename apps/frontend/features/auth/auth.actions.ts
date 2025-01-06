'use server'

import { signOut } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function clientSignOut() {
  await signOut()
}

export async function revalidateAll() {
  await revalidatePath('/', 'layout')
}
