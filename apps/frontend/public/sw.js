self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/icons/192x192.png',
      badge: '/icons/192x192.png',
      vibrate: data.vibrate || [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
      image: data.image,
      actions: data.actions,
      lang: data.lang || 'en',
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received.')
  event.notification.close()
  event.waitUntil(clients.openWindow(process.env.FRONTEND_URL))
})
