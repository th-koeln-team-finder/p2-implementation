import { getTranslations } from 'next-intl/server'

type LocationDef = {
  description?: string
  latitude?: number
  longitude?: number
}

export async function Location({
  location,
}: { location: LocationDef | null | undefined }) {
  if (!location) return
  const t = await getTranslations('projects')
  const map = null

  if (location.latitude && location.longitude) {
  }

  return (
    <div className="inline-flex flex-col justify-start items-start gap-2">
      <h3 className="text-2xl font-medium leading-loose">{t('location')}</h3>
      {map}
      <div className="self-stretch text-base font-normal leading-normal">
        {location.description}
      </div>
    </div>
  )
}
