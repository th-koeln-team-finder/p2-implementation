'use client'
import type { ProjectSkillSelect, SkillSelect } from '@repo/database/schema'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'



type PopulatedProjectSkill = ProjectSkillSelect & {
  skill: SkillSelect
}

// @ts-ignore
export function SkillScale({
  projectSkills,
}: { title?: string; projectSkills: PopulatedProjectSkill[] }) {
  //const t = await getTranslations('projects')
  const translate = useTranslations()

  const [showAll, setShowAll] = useState(false)
  // Funktion zum Umschalten der Sichtbarkeit
  const toggleShowAll = () => setShowAll(!showAll)

  const [itemHeight, setItemHeight] = useState(0)
  const itemRef = useRef<HTMLDivElement>(null)

  // Berechne die Höhe eines Items, sobald das DOM geladen ist
  useEffect(() => {
    if (itemRef.current) {
      // Hole den computedStyle für das Element
      const computedStyle = window.getComputedStyle(itemRef.current)

      // Berechne die tatsächliche Höhe einschließlich des Margins
      const marginBottom = Number.parseFloat(computedStyle.marginBottom)
      const totalHeight = itemRef.current.offsetHeight + marginBottom

      setItemHeight(totalHeight)
      //setItemHeight(itemRef.current.offsetHeight);
    }
  })

  const maxHeight = showAll
    ? `${projectSkills.length * itemHeight}px`
    : `${6 * itemHeight}px`

  return (
    <div className="SkillScale flex w-full flex-col">
      <div className="mb-2 font-medium text-2xl">
        {translate('projects.issueList.issueTitle')}
      </div>

      <div className="flex flex-col" style={{ maxHeight }}>
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out" /*style={{maxHeight}} */
        />
        {projectSkills.map((projectSkill, index) => (
          <div
            key={projectSkill.skillId}
            ref={index === 0 ? itemRef : null}
            className={`mb-2 inline-flex w-full justify-between self-stretch opacity-0 transition-opacity duration-300 ${showAll || index < 6 ? 'opacity-100' : ''}`}
          >
            <div className="text-base">
              {projectSkill.skill ? projectSkill.skill.name : projectSkill.name}
            </div>
            <div className="flex items-center justify-center gap-2.5 py-px">
              {[...Array(5)].map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: Index for the key
                  key={i}
                  className={`h-2 w-2 rounded-full ${i < projectSkill.level ? 'bg-primary' : 'bg-primary/20'}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {projectSkills.length > 6 && (
        <div className="mx-auto inline-flex">
          {/* biome-ignore lint/a11y/useButtonType: <mehr anzeigen> */}
          <button
            onClick={toggleShowAll}
            className="inline-flex gap-4 self-stretch"
          >
            <div className="text-primary">
              {
                showAll
                  ? 'Weniger anzeigen'
                  : 'Mehr anzeigen' /*t('skills.toggleLess') : t('skills.toggleMore')*/
              }
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
      )}
    </div>
  )
}
