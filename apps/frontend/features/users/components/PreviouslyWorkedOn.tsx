'use client'

import {Button} from "@repo/design-system/components/ui/button";
import {ProjectCard} from "@/features/projects/components/ProjectCard";
import {loadMoreProjects} from "@/features/users/users.actions";
import {ChevronDown} from "lucide-react";
import {useState, useEffect } from "react";
import {ProjectSelect} from "@repo/database/schema";

export default function PreviouslyWorkedOn({loadMoreProjectsText}: { loadMoreProjectsText: string }) {
  const [previouslyWorkedOn, setPreviouslyWorkedOn] = useState<ProjectSelect[]>([])

  function loadMore (count = 10) {
    loadMoreProjects(count, previouslyWorkedOn.length).then((projects: ProjectSelect[]) => {
      setPreviouslyWorkedOn([...previouslyWorkedOn, ...projects])
    })
  }
  useEffect(() => {
    loadMore(3)
  }, [])

  return <div className="text-center">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {previouslyWorkedOn.map((project) => (
        <ProjectCard key={project.name} project={project}/>
      ))}
    </div>
    <Button
      variant="link"
      className="my-2"
      onClick={() => loadMore()}
    > <ChevronDown/>{loadMoreProjectsText}
    </Button>
  </div>;
}