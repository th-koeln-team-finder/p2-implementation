'use client'

import type { ProjectIssueSelect } from '@repo/database/schema'
//TODO import { Link } from '@/features/i18n/routing'
//TODO import { ProjectIssuesList } from '@/features/projects/projects.queries'
//should import "Issues" Data from additionalInfo:Json
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card'
//TODO import {getTranslations} from "next-intl/server";
import { useEffect, useRef, useState } from 'react'

//export type Issue = { title: string; description: string; id: number }

function extractTextFromDescription(desc: string) {
  const parsedDescription = JSON.parse(desc) // JSON-String in Objekt umwandeln
  let extractedText = ''

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const traverseNodes = (nodes: any) => {
    for (const node of nodes) {
      if (node.type === 'text' && node.text) {
        extractedText += node.text
      }
      if (node.children) {
        traverseNodes(node.children)
      }
    }
  }

  if (parsedDescription.root?.children) {
    traverseNodes(parsedDescription.root.children)
  }

  return extractedText
}

export function ProjectIssuesList(
  {
    listOfIssues,
  }: {
    listOfIssues: ProjectIssueSelect[]
  },
  //const data = await getProjectIssues()
) {
  const [showAll, setShowAll] = useState(false)

  const toggleShowAll = () => setShowAll(!showAll)

  if (!Array.isArray(listOfIssues) || listOfIssues.length === 0)
    return <p className="text-muted-foreground italic">No Issues</p>

  const [itemHeight, setItemHeight] = useState(0)
  const itemRef = useRef<HTMLDivElement>(null)

  // Berechne die Höhe eines Items, sobald das DOM geladen ist
  useEffect(() => {
    if (itemRef.current) {
      setItemHeight(itemRef.current.offsetHeight)
    }
  })

  const maxHeight = showAll
    ? `${listOfIssues.length * itemHeight * 2}px`
    : `${3 * itemHeight}px`

  return (
    <div className="inline-flex flex-col items-start justify-start gap-4">
      <div className="self-stretch font-medium text-2xl leading-loose">
        {'issuesTitle'}({listOfIssues.length})
      </div>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out "
        style={{ maxHeight }}
      >
        {listOfIssues.map((issue, index) => (
          <Card
            key={issue.id}
            ref={index === 0 ? itemRef : null}
            className={`mb-2 inline-flex w-full justify-between self-stretch opacity-0 transition-opacity duration-300 ${showAll || index < 4 ? 'opacity-100' : ''}`}
          >
            <CardHeader className="p-2">
              <CardTitle>{issue.title}</CardTitle>
              <CardDescription>
                {typeof issue.description === 'string' &&
                issue.description.startsWith('{')
                  ? extractTextFromDescription(issue.description)
                  : issue.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      {listOfIssues.length > 3 && (
        <div className="mx-auto inline-flex">
          {/* biome-ignore lint/a11y/useButtonType: <mehr anzeigen> */}
          <button
            onClick={toggleShowAll}
            className="inline-flex gap-4 self-stretch"
          >
            <div className="text-primary">
              {showAll ? 'Weniger anzeigen' : 'Mehr anzeigen'}
            </div>
            <div
              className={`my-auto transform transition-transform ${showAll ? '-rotate-180' : 'rotate-0'} duration-300`}
            >
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: <svg> */}
              <svg
                width="21"
                height="12"
                viewBox="0 0 21 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.208 0.86652C20.598 1.27152 20.598 1.92652 20.208 2.33052L11.944 10.8935C11.7619 11.0852 11.5426 11.2378 11.2996 11.3421C11.0566 11.4464 10.795 11.5002 10.5305 11.5002C10.2661 11.5002 10.0044 11.4464 9.76142 11.3421C9.51843 11.2378 9.29918 11.0852 9.11702 10.8935L0.792021 2.26852C0.605968 2.07277 0.501394 1.81355 0.499537 1.5435C0.49768 1.27344 0.598678 1.01281 0.782021 0.81452C0.872561 0.716291 0.982302 0.637696 1.10445 0.5836C1.2266 0.529504 1.35855 0.50106 1.49214 0.500029C1.62572 0.498998 1.7581 0.525402 1.88107 0.577605C2.00403 0.629809 2.11497 0.706701 2.20702 0.80352L9.82402 8.69752C9.91511 8.79344 10.0248 8.86982 10.1463 8.92201C10.2678 8.97421 10.3987 9.00112 10.531 9.00112C10.6633 9.00112 10.7942 8.97421 10.9157 8.92201C11.0373 8.86982 11.1469 8.79344 11.238 8.69752L18.795 0.86652C18.886 0.77063 18.9956 0.694268 19.1171 0.642085C19.2385 0.589903 19.3693 0.562992 19.5015 0.562992C19.6337 0.562992 19.7645 0.589903 19.886 0.642085C20.0075 0.694268 20.117 0.77063 20.208 0.86652Z"
                  fill="#A21CAF"
                />
              </svg>
            </div>
          </button>
        </div>
      )}{' '}
    </div>
  )
}
