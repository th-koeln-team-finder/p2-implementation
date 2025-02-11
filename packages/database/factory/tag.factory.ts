import { faker } from '@faker-js/faker/locale/de'
import { generateTextEmbeddings } from '@repo/semantic-search'
import type { TagInsert } from '../schema'

function formatTagName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

export const technicalTags = [
  'Next.js',
  'React Native',
  'Fastify',
  'TypeScript',
  'JavaScript',
  'Turborepo',
  'PNPM',
  'Drizzle ORM',
  'SQLite',
  'PostgreSQL',
  'Docker',
  'Caddy',
  'Tailwind CSS',
  'tldraw',
  'Auth.js',
  'i18n-next',
  'Go',
  'Sage',
  'MSSQL',
  'Pimcore',
  'SPFx',
  'SharePoint',
  'Microsoft Teams',
  'GitHub Actions',
  'Node.js',
  'WebSockets',
  'GraphQL',
  'REST API',
  'Redis',
  'RabbitMQ',
  'gRPC',
  'Prisma',
  'Zod',
  'TRPC',
  'Supabase',
  'Vercel',
  'Cloudflare',
  'Tauri',
  'Electron',
  'Capacitor',
  'Expo',
  'Jotai',
  'Recoil',
  'zustand',
  'RxJS',
  'Three.js',
  'D3.js',
  'WebRTC',
  'Figma API',
  'Playwright',
  'Cypress',
  'Vitest',
  'Esbuild',
  'Vite',
  'Parcel',
  'Terser',
  'Bun',
  'Nginx',
  'OpenTelemetry',
  'Prometheus',
  'Grafana',
  'Terraform',
  'Ansible',
  'SEO',
  'Content Marketing',
  'Social Media',
  'Email Marketing',
  'PPC',
  'Google Ads',
  'Facebook Ads',
  'Instagram Ads',
  'LinkedIn Marketing',
  'Influencer Marketing',
  'Affiliate Marketing',
  'Growth Hacking',
  'Brand Strategy',
  'Market Research',
  'A/B Testing',
  'Conversion Rate Optimization',
  'Customer Journey',
  'Lead Generation',
  'Retargeting',
  'User Engagement',
  'Customer Retention',
  'Copywriting',
  'Storytelling',
  'Marketing Automation',
  'CRM',
  'Google Analytics',
  'Heatmaps',
  'Funnel Optimization',
  'Landing Pages',
  'Viral Marketing',
  'Neuromarketing',
]

export async function makeTag(
  availableTags: string[],
  uniqueTags: Set<string>,
): Promise<TagInsert | null> {
  let tries = 0
  let name = formatTagName(faker.helpers.arrayElement(availableTags))

  while (uniqueTags.has(name) && tries < 10) {
    name = formatTagName(faker.helpers.arrayElement(technicalTags))
    tries++
  }

  if (tries >= 10) {
    return null
  }
  uniqueTags.add(name)
  console.log('Making tag:', name)
  const embedding = await generateTextEmbeddings(name, 'small')

  return {
    name,
    embedding,
  }
}
