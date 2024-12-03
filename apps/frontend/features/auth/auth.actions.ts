'use server'

import { signOut } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function clientSignOut() {
  await signOut()
  revalidatePath('/')
}
