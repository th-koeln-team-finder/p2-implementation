'use client'

import {Button} from "@repo/design-system/components/ui/button";
import {ProjectCard} from "@/features/projects/components/ProjectCard";
import {loadMoreProjects} from "@/features/users/users.actions";
import {ChevronDown} from "lucide-react";
import {useState} from "react";
import {ProjectSelect} from "@repo/database/schema";

export default function PreviouslyWorkedOn({loadMoreProjectsText}: { loadMoreProjectsText: string }) {
  const [previouslyWorkedOn, setPreviouslyWorkedOn] = useState<ProjectSelect[]>([])


  loadMoreProjects(3).then((projects: ProjectSelect[]) => {
    setPreviouslyWorkedOn([...previouslyWorkedOn, ...projects])
  })

  function loadMore () {
    loadMoreProjects(10, previouslyWorkedOn.length).then((projects: ProjectSelect[]) => {
      setPreviouslyWorkedOn([...previouslyWorkedOn, ...projects])
    })
  }

  return <div className="text-center">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {previouslyWorkedOn.map((project) => (
        <ProjectCard key={project.name} project={project}/>
      ))}
    </div>
    <Button
      variant="link"
      onClick={() => loadMore}
    > <ChevronDown/>{loadMoreProjectsText}
    </Button>
  </div>;
}