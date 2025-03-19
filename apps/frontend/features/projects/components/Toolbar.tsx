'use client'

import {
    getUserProfile,
    joinProject,
    toggleProjectBookmark, toggleProjectStar,
} from '@/features/projects/projects.actions'
import { Button } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'
import {BookmarkIcon, LinkIcon, StarIcon} from 'lucide-react'
import { useTranslations } from 'next-intl'
import {useEffect, useOptimistic, useState, useTransition} from 'react'
import {CanUserClient} from "@/features/auth/components/CanUser.client";
import {authMiddleware} from "@/auth";
import {useSessionPermission} from "@/features/auth/auth.hooks";
import type {PopulatedBrainstormComment} from "@/features/brainstorm/brainstorm.types";
import type {OptimisticPayload} from "@/features/brainstorm/brainstormComment.hooks";
import {ProjectSelect, type UserSelect} from "@repo/database/schema";
import {CreateProjectFormValues, PopulatedProject} from "@/features/projects/projects.types";
import {useRouter} from "@/features/i18n/routing";
import {useSession} from "next-auth/react";


type ProjectProps = {
    project: PopulatedProject
    setOptimistic: (payload: OptimisticPayload) => void
}

export function Toolbar({
  project,
  setOptimistic,
}:ProjectProps) {
    const t = useTranslations('projects')
    const router = useRouter()
    const { data: session } = useSession()
    const isCreator = session?.user?.id === project.createdBy

    const [_, startTransition] = useTransition()
    const canCreate = useSessionPermission('project', 'create')
    const [optimisticBookmarked, dispatchOptimisticBookmark] = useOptimistic(
    project.isBookmarked,
    (_, payload: boolean) => {
      return payload
    },
  )
 const [optimisticStared, dispatchOptimisticStar] = useOptimistic(
    project.isStared,
    (_, payload: boolean) => {
      return payload
    },
  )
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex flex-row items-center gap-1">
          <Button
              variant="ghost"
              type="button"
              disabled={!canCreate}
              onClick={async (e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  startTransition(() => dispatchOptimisticStar(!optimisticStared))
                  await toggleProjectStar(project.id, !optimisticStared)
              }}
          >
              {project.starCount!=0? project.starCount : ""}
              <StarIcon
                    className={cn(optimisticStared && 'fill-foreground')}
              />
          </Button>
          <Button variant="ghost" type="button" size="icon">
              <LinkIcon />
          </Button>
          <CanUserClient target="project" action="create">
        <Button
          variant="ghost"
          type="button"
          size="icon"
          onClick={async (e) => {
            e.stopPropagation()
            e.preventDefault()
            startTransition(() => dispatchOptimisticBookmark(!optimisticBookmarked))
            await toggleProjectBookmark(project.id, !optimisticBookmarked)
          }}
        >
          <BookmarkIcon
            className={cn(optimisticBookmarked && 'fill-foreground')}
          />
        </Button>
          </CanUserClient>
      </div>
        <CanUserClient target="project" action="create">
            <Button
                variant="default"
                size="default"
                className="ml-2 w-full lg:w-auto"
                onClick={async () => {
                    if (isCreator) {
                        router.push(`/projects/${project.id}/findSomeone`)
                    } else {
                        await joinProject(project.id)
                    }
                }}
            >
                {isCreator ?"find Someone": t('join') }
            </Button>
        </CanUserClient>
    </div>
  )
}
//TODO: JoinButton sollte nur angezeigt werden, wenn man nicht der Ersteller des Projekts ist. Im Moment wird kurzeitig der Join Button angezeigt.
