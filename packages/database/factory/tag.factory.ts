import { faker } from '@faker-js/faker/locale/de'
import { generateTextEmbeddings } from '@repo/semantic-search'
import type { TagInsert } from '../schema'

function formatTagName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

export const technicalTags = [
  'Next.js',
  'React Native',
  'TypeScript',
  'JavaScript',
  'Drizzle ORM',
  'SQLite',
  'PostgreSQL',
  'Docker',
  'Caddy',
  'Tailwind CSS',
  'Go',
  'Sage',
  'MSSQL',
  'Pimcore',
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
  'Vercel',
  'Cloudflare',
  'Tauri',
  'Electron',
  'Capacitor',
  'Expo',
  'Jotai',
  'zustand',
  'RxJS',
  'Three.js',
  'D3.js',
  'WebRTC',
  'Figma API',
  'Playwright',
  'Cypress',
  'Vite',
  'Bun',
  'Nginx',
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
