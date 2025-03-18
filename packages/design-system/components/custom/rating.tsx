'use client'

import { cn } from '../../lib/utils'
import { useFieldContext } from '@formsignals/form-react'
import { Star } from 'lucide-react'
import React, { useState } from 'react'

const ratingVariants = {
  default: {
    star: 'text-primary',
    emptyStar: 'text-muted-foreground',
  },
  destructive: {
    star: 'text-red-500',
    emptyStar: 'text-red-200',
  },
  yellow: {
    star: 'text-yellow-500',
    emptyStar: 'text-yellow-200',
  },
}

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number
  totalStars?: number
  fill?: boolean
  Icon?: React.ReactElement
  variant?: keyof typeof ratingVariants
  onRatingChange?: (rating: number) => void
  fillDisabled?: boolean
  showText?: boolean // Add showText prop
  disabled?: boolean
  rowClassName?: string
  starClassName?: string
}

export const Rating = ({
  rating: initialRating,
  totalStars = 5,
  fill = true,
  Icon = <Star />,
  variant = 'default',
  onRatingChange,
  fillDisabled = true,
  showText = true, // Default to true if disabled prop is not provided
  disabled = false, // Default to false if disabled prop is not provided
  className,
  rowClassName,
  starClassName,
  ...props
}: RatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [currentRating, setCurrentRating] = useState(initialRating)
  const [_isHovering, setIsHovering] = useState(false)

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      setIsHovering(true)
      const starIndex = Number.parseInt(
        (event.currentTarget as HTMLDivElement).dataset.starIndex || '0',
      )
      setHoverRating(starIndex)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setHoverRating(null)
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      const starIndex = Number.parseInt(
        (event.currentTarget as HTMLDivElement).dataset.starIndex || '0',
      )
      setCurrentRating(starIndex)
      setHoverRating(null)
      if (onRatingChange) {
        onRatingChange(starIndex)
      }
    }
  }

  const displayRating = disabled
    ? initialRating
    : (hoverRating ?? currentRating)
  const fullStars = Math.floor(displayRating)
  const partialStar =
    displayRating % 1 > 0 ? (
      <PartialStar
        fillPercentage={displayRating % 1}
        className={cn(ratingVariants[variant].star, starClassName)}
        emptyClassName={cn(ratingVariants[variant].emptyStar, starClassName)}
        Icon={Icon}
      />
    ) : null

  return (
    <div
      className={cn(
        'flex w-fit flex-col gap-2',
        {
          'pointer-events-none': disabled,
        },
        {
          'cursor-pointer': !disabled,
        },
        className,
      )}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        className={cn('flex items-center', rowClassName)}
        onMouseEnter={handleMouseEnter}
      >
        {[...Array(fullStars)].map((_, i) =>
          React.cloneElement(Icon, {
            // biome-ignore lint/suspicious/noArrayIndexKey: There is no state associated with the index
            key: i,
            className: cn(
              fill ? 'fill-current stroke-1' : 'fill-transparent',
              ratingVariants[variant].star,
              starClassName,
            ),
            onClick: handleClick,
            onMouseEnter: handleMouseEnter,
            'data-star-index': i + 1,
          }),
        )}
        {partialStar}
        {[
          ...Array(Math.max(0, totalStars - fullStars - (partialStar ? 1 : 0))),
        ].map((_, i) =>
          React.cloneElement(Icon, {
            key: i + fullStars + 1,
            className: cn(
              'stroke-1',
              fillDisabled ? 'fill-current' : 'fill-transparent',
              ratingVariants[variant].emptyStar,
              starClassName,
            ),
            onClick: handleClick,
            onMouseEnter: handleMouseEnter,
            'data-star-index': i + fullStars + 1,
          }),
        )}
      </div>
      {showText && (
        <span className="font-semibold text-muted-foreground text-xs">
          Current Rating: {`${currentRating}`}
        </span>
      )}
    </div>
  )
}

interface PartialStarProps {
  fillPercentage: number
  className?: string
  emptyClassName?: string
  Icon: React.ReactElement
}

const PartialStar = ({
  fillPercentage,
  className,
  emptyClassName,
  Icon,
}: PartialStarProps) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {React.cloneElement(Icon, {
        className: cn('fill-current', className, emptyClassName),
      })}
      <div
        style={{
          position: 'absolute',
          top: 0,
          overflow: 'hidden',
          width: `${fillPercentage * 100}%`,
        }}
      >
        {React.cloneElement(Icon, {
          className: cn('fill-current', className),
        })}
      </div>
    </div>
  )
}

export function RatingForm(
  props: Omit<RatingProps, 'rating' | 'onRatingChange'>,
) {
  const field = useFieldContext<number, ''>()
  return (
    <Rating
      rating={field.data.value}
      onRatingChange={(newRating) => field.handleChange(newRating)}
      {...props}
    />
  )
}
