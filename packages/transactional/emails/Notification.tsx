import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { serverEnv } from '@repo/env'
import { LangDict, type LangKey } from '@repo/i18n'

type SupportedLang = keyof typeof LangDict

interface NotificationEmailProps {
  user: {
    name: string
    firstName: string | null
    lastName: string | null
    email: string
  }
  data: {
    title: string
    body: string
    image?: string
    lang?: SupportedLang
    actions?: { action: string; title: string; icon?: string }[]
    data?: { link?: string; linkText?: string }
  }
}

function translate(lang: SupportedLang, key: LangKey): string {
  try {
    const keyParts = key.split('.')
    let result: unknown = LangDict[lang]

    for (const part of keyParts) {
      if (!result || typeof result !== 'object') return key
      result = (result as Record<string, unknown>)[part]
    }

    if (typeof result !== 'string') {
      result = LangDict.en

      for (const part of keyParts) {
        if (!result || typeof result !== 'object') return key
        result = (result as Record<string, unknown>)[part]
      }
    }

    return typeof result === 'string' ? result : key
  } catch {
    return key
  }
}

export const NotificationEmail = ({ user, data }: NotificationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>{data.title}</Preview>
      <Container style={container}>
        <Img
          src={`${serverEnv.FRONTEND_URL}/icons/192x192.png`}
          width="32"
          height="32"
          alt="Collaborize logo"
        />

        <Text style={title}>
          <strong>@{user.name}</strong>, {data.title}
        </Text>

        <Section style={section}>
          <Text style={text}>{data.body}</Text>

          {data.actions && data.actions.length > 0
            ? data.actions.map((action) => (
                <Button key={action.action} style={button} href={action.action}>
                  {action.title}
                </Button>
              ))
            : data.data?.link && (
                <Button
                  style={button}
                  href={`${serverEnv.FRONTEND_URL}${data.data.link}`}
                >
                  {data.data.linkText || 'View your token'}
                </Button>
              )}
        </Section>

        {data.image && (
          <Img
            src={`${serverEnv.FRONTEND_URL}${data.image}`}
            width="100%"
            height="auto"
            alt="Collaborize"
          />
        )}

        <Text style={footer}>
          {translate(data.lang || 'en', 'email.footer')}{' '}
        </Text>
      </Container>
    </Body>
  </Html>
)

NotificationEmail.PreviewProps = {
  user: {
    name: 'john_doe',
    firstName: null,
    lastName: null,
    email: 'mail@example.com',
  },
  data: {
    title:
      'A fine-grained personal access token has been added to your account',
    body: 'A fine-grained personal access token has been added to your account',
    lang: 'en',
  },
} as NotificationEmailProps

export default NotificationEmail

const main = {
  backgroundColor: 'hsl(0 0% 100%)',
  color: 'hsl(240 6% 10%)',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
}

const container = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '20px 0 48px',
}

const title = {
  fontSize: '24px',
  lineHeight: 1.25,
}

const section = {
  padding: '24px',
  border: 'solid 1px hsl(240 5% 84%)',
  borderRadius: '0.35rem',
  textAlign: 'center' as const,
}

const text = {
  margin: '0 0 10px 0',
  textAlign: 'left' as const,
}

const button = {
  fontSize: '14px',
  backgroundColor: 'hsl(295 72% 40%)',
  color: 'hsl(289 100% 98%)',
  lineHeight: 1.5,
  borderRadius: '0.5em',
  padding: '12px 24px',
}

const footer = {
  color: 'hsl(240 4% 46%)',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '60px',
}
