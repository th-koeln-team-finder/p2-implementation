import { render } from '@react-email/components'
import { serverEnv } from '@repo/env/server'
import nodemailer from 'nodemailer'
import type Mail from 'nodemailer/lib/mailer'
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
  const emailPlainText = await render(template, { plainText: true })

  const optionsWithRendered: Mail.Options = {
    ...options,
    html: emailHtml,
    text: emailPlainText,
  }

  try {
    await transporter.sendMail(optionsWithRendered)
  } catch (error) {
    console.error(error)
  }
}
