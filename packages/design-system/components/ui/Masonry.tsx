"use client"

import { PropsWithChildren } from 'react'
import ReactMasonry, {ResponsiveMasonry, ResponsiveMasonryProps} from "react-responsive-masonry"

type MasonryProps = ResponsiveMasonryProps & {
  masonryGutter?: string
}

export function Masonry({children, masonryGutter, ...props}: PropsWithChildren<MasonryProps>) {
  return (
    <ResponsiveMasonry {...props}>
      <ReactMasonry gutter={masonryGutter}>
        {children}
      </ReactMasonry>
    </ResponsiveMasonry>
  )
}