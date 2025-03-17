import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {isUserAppliedToProject, isUserMemberOfProject} from '@/features/projects/projects.actions'

export function useIsUserAppliedToProject(projectId: string) {
  const { data: session } = useSession()
  const [isApplied, setIsApplied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) {
      return
    }
    isUserAppliedToProject(session?.user?.id, projectId)
      .then((isUserApplied) => {
        setIsApplied(!!isUserApplied)
      })
      .finally(() => {
        setLoading(false)
      })
  })
  return [isApplied, loading] as const
}

export function useIsUserMemberOfProject(projectId: string) {
  const { data: session } = useSession()
  const [isMember, setIsUserMemberOfProject] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!session?.user?.id) {
      return
    }
    isUserMemberOfProject(session?.user?.id, projectId)
      .then((isUserMemberOfProject) => {
        setIsUserMemberOfProject(isUserMemberOfProject)
      })
      .finally(() => {
        setLoading(false)
      })
  })
  return [isMember, loading] as const
}
