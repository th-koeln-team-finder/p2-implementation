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
    <Image src={imageUrl} alt="Image" layout="fill" objectFit="cover" />

    {/* Overlay mit Deckkraft */}
    <div className="absolute inset-0 bg-black/50" />

    <div
      className={`relative my-auto flex h-auto w-full flex-col gap-4 px-10 py-7 lg:gap-8 lg:px-20 lg:py-14 ${cardFull ? 'lg:flex-row' : 'lg:flex-col'}`}
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
      'text-center font-semibold text-lg text-white sm:text-2xl xl:text-3xl',
      className,
    )}
    {...props}
  />
))
ImageCardTitle.displayName = 'ImageCardTitle'

const ImageCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-center text-sm text-white sm:text-lg', className)}
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
  ImageCardContent,
}
