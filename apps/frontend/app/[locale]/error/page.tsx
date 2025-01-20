import { getTranslations } from 'next-intl/server'

// TODO - improve styling

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { error } = await searchParams
  const translate = await getTranslations()
  const errorText =
    {
      Configuration: translate('errors.auth.configuration'),
      AccessDenied: translate('errors.auth.accessDenied'),
      Verification: translate('errors.auth.verification'),
      Default: translate('errors.auth.default'),
    }[error as string] || 'genericPageError'
  return (
    <main className="container mx-auto my-4">
      <h1 className="font-bold text-3xl">{errorText}</h1>
    </main>
  )
}
