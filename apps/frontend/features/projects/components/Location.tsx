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
    <div className="inline-flex flex-col items-start justify-start gap-2">
      <h3 className="font-medium text-2xl leading-loose">{t('location')}</h3>
      {map}
      <div className="self-stretch font-normal text-base leading-normal">
        {location.description}
      </div>
    </div>
  )
}
