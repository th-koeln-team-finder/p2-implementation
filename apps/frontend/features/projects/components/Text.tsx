
// @ts-ignore
export function Text({ description }: { description?: string}) {

  return (
      <div className='Text flex w-full flex-col'>
        <div className='font-normal text-base'>{ description }</div>
      </div>
  )
}
