'use client'

import {Button} from "@repo/design-system/components/ui/button";
import {ProjectCard} from "@/features/projects/components/ProjectCard";
import {loadMoreProjects} from "@/features/users/users.actions";
import {ChevronDown, LoaderCircle} from "lucide-react";
import * as React from "react";
import {useEffect, useState} from "react";
import type {UserProjectsSelect} from "@repo/database/schema";
import {useTranslations} from "next-intl";

export default function PreviouslyWorkedOn({
  userId,
}: { userId: string }) {
  const [previouslyWorkedOn, setPreviouslyWorkedOn] = useState<
    UserProjectsSelect[]
  >([])
  const [loading, setLoading] = useState(false)
  const [allLoaded, setAllLoaded] = useState(false)
  const translate = useTranslations('users')

  function loadMore(count = 10) {
    if (loading) return
    setLoading(true)
    loadMoreProjects(userId, count, previouslyWorkedOn.length).then(
      (projects: UserProjectsSelect[]) => {
        setLoading(false)
        setPreviouslyWorkedOn([...previouslyWorkedOn, ...projects])
        if (projects.length < count) {
          setAllLoaded(true)
        }
      },
    )
  }

  useEffect(() => {
    loadMore(3)
  }, [])

  return (
    <div className="text-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {previouslyWorkedOn.map((project) => (
          <ProjectCard
            key={project.projectName}
            project={{
              id: project.projectId || 0,
              name: project.projectName || '',
              description: project.projectDescription || '',
            }}
          />
        ))}
      </div>
      {loading ? (
        <LoaderCircle className="animate-spin mx-auto" />
      ) : (
        !allLoaded && (
          <Button variant="link" className="my-2" onClick={() => loadMore()}>
            {' '}
            <ChevronDown />
            {translate('loadMoreProjects')}
          </Button>
        )
      )}
      {previouslyWorkedOn.length === 0 && !loading && <p>{translate('noProjectsFound')}</p>}
    </div>
  )
}
