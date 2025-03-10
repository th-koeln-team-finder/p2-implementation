import { Button, Html } from '@react-email/components'

export const MyEmail = ({ url }: { url: string }) => {
  return (
    <Html>
      <Button
        href={url}
        style={{ background: '#000', color: '#fff', padding: '12px 20px' }}
      >
        Click me
      </Button>
    </Html>
  )
}

export default MyEmail
