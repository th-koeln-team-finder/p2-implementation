import { getTranslations } from 'next-intl/server'

// @ts-ignore
export async function Text({ description }: { description?: string}) {
  const t = await getTranslations('projects')

  return (
      <div className='Text flex w-full flex-col'>
        <div className='font-normal text-base'>{ description }</div>
      </div>
  )
}
