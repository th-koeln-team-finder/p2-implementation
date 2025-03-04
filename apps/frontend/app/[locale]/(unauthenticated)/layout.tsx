export default function UnauthenticatedLayout({
  children,
  modals,
}: Readonly<{
  children: React.ReactNode
  modals: React.ReactNode
}>) {
  return (
    <>
      {children}
      {modals}
    </>
  )
}
