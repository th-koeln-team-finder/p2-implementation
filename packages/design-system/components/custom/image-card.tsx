import Image from 'next/image'
import * as React from 'react'

import { cn } from '../../lib/utils'

const ImageCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    imageUrl: string
    cardFull?: boolean
  }
>(({ className, imageUrl, cardFull, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex min-h-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow',
      className,
    )}
    {...props}
  >
    <div
      className="absolute inset-0 bg-center bg-cover"
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
    <Image src={imageUrl} alt="Image" layout="fill" objectFit="cover" />

    {/* Overlay mit Deckkraft */}
    <div className="absolute inset-0 bg-black/40" />

    <div
      className={`relative flex h-auto w-full flex-col justify-between gap-4 px-10 py-7 lg:gap-8 lg:px-20 lg:py-14 ${cardFull ? 'lg:flex-row' : 'lg:flex-col'}`}
    >
      {props.children}
    </div>
  </div>
))
ImageCard.displayName = 'ImageCard'

const ImageCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col items-center space-y-1.5', className)}
    {...props}
  />
))
ImageCardHeader.displayName = 'ImageCardHeader'

const ImageCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-center font-semibold text-white text-xl lg:text-3xl',
      className,
    )}
    {...props}
  />
))
ImageCardTitle.displayName = 'ImageCardTitle'

const ImageCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-center text-sm text-white', className)}
    {...props}
  />
))
ImageCardDescription.displayName = 'ImageCardDescription'

const ImageCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('m-0 pt-0 text-center text-white text-xl', className)}
    {...props}
  />
))
ImageCardContent.displayName = 'ImageCardContent'

const ImageCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
))
ImageCardFooter.displayName = 'ImageCardFooter'

export {
  ImageCard,
  ImageCardHeader,
  ImageCardFooter,
  ImageCardTitle,
  ImageCardDescription,
  ImageCardContent,
}
