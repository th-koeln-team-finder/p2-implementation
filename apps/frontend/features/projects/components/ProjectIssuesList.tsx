'use client'

import type { ProjectIssueSelect } from '@repo/database/schema'
import { Button } from '@repo/design-system/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible'
import { ChevronDownIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ProjectIssuesList({
  listOfIssues,
}: {
  listOfIssues: ProjectIssueSelect[]
}) {
  const translate = useTranslations()

  return (
    <div className="w-full">
      <h2 className="mb-2 font-medium text-2xl">
        {translate('projects.issueList.issueTitle')}
      </h2>

      <div
        className="max-h-96 overflow-auto pr-1 pb-1"
        style={{ scrollbarGutter: 'stable' }}
      >
        <Collapsible className="group">
          <ProjectIssuesListContent issues={listOfIssues.slice(0, 3)} />
          <CollapsibleContent>
            <ProjectIssuesListContent issues={listOfIssues.slice(3)} />
          </CollapsibleContent>
          {listOfIssues.length > 3 && (
            <div className="-bottom-1 sticky flex flex-row bg-background py-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="mx-auto">
                  <p className="block group-data-[state=open]:hidden">
                    Show more
                  </p>
                  <p className="hidden group-data-[state=open]:block">
                    Show less
                  </p>
                  <ChevronDownIcon className="group-data-[state=open]:-rotate-180 rotate-0 transition-transform" />
                </Button>
              </CollapsibleTrigger>
            </div>
          )}
        </Collapsible>
      </div>
    </div>
  )
}

type ProjectIssuesListContentProps = {
  issues: ProjectIssueSelect[]
}

function ProjectIssuesListContent({ issues }: ProjectIssuesListContentProps) {
  return (
    <div className="flex flex-col gap-2">
      {issues.map((issue) => (
        <ProjectIssuesListItem issue={issue} key={issue.id ?? issue.title} />
      ))}
    </div>
  )
}

type ProjectIssuesListItemProps = {
  issue: ProjectIssueSelect
}

function ProjectIssuesListItem({ issue }: ProjectIssuesListItemProps) {
  return (
    <Card key={issue.id}>
      <CardHeader className="p-2">
        <CardTitle>{issue.title}</CardTitle>
        <CardDescription>{issue.description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
