import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Collaborize App',
    short_name: 'Collaborize',
    description: 'Create and find teams to collaborate with',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: 'rgb(163, 29, 175)',
    icons: [
      {
        src: '/icons/192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
