import { render } from '@react-email/components'
import { serverEnv } from '@repo/env/server'
import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'

export default async function sendEmail(
  template: React.ReactElement,
  options: SMTPTransport.Options,
) {
  const transporter = nodemailer.createTransport({
    host: serverEnv.MAIL_HOST,
    port: serverEnv.MAIL_PORT,
    secure: serverEnv.MAIL_PORT === 465,
    auth: {
      user: serverEnv.MAIL_USERNAME,
      pass: serverEnv.MAIL_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  })

  const emailHtml = await render(template)

  const optionsWithRenderedHTML = {
    ...options,
    html: emailHtml,
  }

  try {
    await transporter.sendMail(optionsWithRenderedHTML)
  } catch (error) {
    console.error(error)
  }
}
