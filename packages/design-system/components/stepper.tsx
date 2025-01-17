'use client'

import * as React from 'react'
import { Button } from '../components/ui/button'
import { useTranslations } from 'next-intl'

const StepperComponent = ({
  steps,
  children,
  currentIndex,
  onNext,
  onReset,
  onDone,
  onPrevious,
  jumpToStep,
}: {
  steps: { id: string; title: string; description?: string }[]
  currentIndex: number
  onNext?: () => void
  onPrevious?: () => void
  onReset?: () => void
  onDone?: () => void
  jumpToStep?: (index: number) => void
  children?: React.ReactNode
}) => {
  const currentStep = steps[currentIndex]

  // Dynamisch nur das passende ContentItem rendern
  const stepContent = React.Children.toArray(children).find(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (child: any) => child.props?.stepId === currentStep.id,
  )

  const t = useTranslations()

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mx-auto mb-16 w-fit">
        <nav aria-label="Steps Navigation" className="group my-4">
          <ol
            className="flex flex-wrap items-center justify-between gap-2"
            aria-orientation="horizontal"
          >
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <li className="flex items-center gap-4">
                  <Button
                    role="tab"
                    aria-current={index === currentIndex ? 'step' : undefined}
                    aria-posinset={index + 1}
                    aria-setsize={steps.length}
                    className={`flex size-10 items-center justify-center rounded-full ${
                        index <= currentIndex
                            ? 'bg-primary text-white'
                            : 'border-2 border-primary border-dotted bg-transparent text-primary'
                    }`}
                    onClick={() => jumpToStep?.(index)}
                  >
                    {index + 1}
                  </Button>
                  <span
                    className={`font-medium text-sm ${index < currentIndex ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {step.title}
                  </span>
                </li>
                {index < steps.length - 1 && (
                  <div
                    className={`-translate-y-1/2 h-2 min-w-20 flex-1 border-b-2 ${index < currentIndex ? 'border-primary border-solid' : 'border-gray-400 border-dotted'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>

      <div className="mb-20 w-full">
        <h1 className="mb-4 font-medium text-lg">{currentStep.title}</h1>
        {stepContent}
      </div>

      <div className="fixed bottom-0 z-99 flex w-full justify-between bg-white py-6">
        <div className="relative left-4 flex justify-center text-muted-foreground text-sm">
          Step {currentIndex + 1} of {steps.length}
        </div>

        <div className="relative right-4 flex justify-center gap-4">
          {currentIndex > 0 && (
            <Button
              variant="outline"
              className="rounded border-2 bg-transparent px-4 py-2"
              onClick={onPrevious}
            >
              Back
            </Button>
          )}
          {currentIndex < steps.length - 1 ? (
            <Button className="rounded px-4 py-2" onClick={onNext}>
              Next
            </Button>
          ) : (
            <Button
              className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
              onClick={onReset}
            >
              Reset
            </Button>
          )}
          {currentIndex === steps.length - 1 && (
            <Button
              className="rounded px-4 py-2 text-white hover:bg-primary"
              onClick={onDone}
            >
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

const ContentItem = ({
  stepId,
  children,
}: { stepId: string; children?: React.ReactNode }) => {
  return <div className={`${stepId} flex flex-col gap-4`}>{children}</div>
}

export { StepperComponent, ContentItem }
