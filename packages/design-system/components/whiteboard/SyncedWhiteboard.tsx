'use client'

import {
  AssetRecordType,
  InstancePresenceRecordType,
  type TLAssetStore,
  type TLBookmarkAsset,
  Tldraw,
  getHashForString,
  uniqueId,
} from 'tldraw'
import 'tldraw/tldraw.css'
import { useSync } from '@tldraw/sync'

type WhiteboardProps = {
  className?: string
  roomId: string
  user?: { id: string; name: string } | null
}

const WORKER_URL = 'https://collaborize.localhost/_sync'

export function SyncedWhiteboard({ className, roomId, user }: WhiteboardProps) {
  const store = useSync({
    uri: `${WORKER_URL}/connect/${roomId}?userId=${user?.id}`,
    assets: multiplayerAssets,
    userInfo: {
      name: user?.name ?? 'Anonymous',
      id: user?.id ?? 'anonymous',
    },
  })

  return (
    <Tldraw
      className={className}
      store={store}
      acceptedImageMimeTypes={[]}
      acceptedVideoMimeTypes={[]}
      maxAssetSize={0}
      onMount={(editor) => {
        // @ts-expect-error - this is a hack to make the editor available in the console
        window.editor = editor
        editor.registerExternalAssetHandler('url', unfurlBookmarkUrl)

        const peerPresence = InstancePresenceRecordType.create({
          id: InstancePresenceRecordType.createId(editor.store.id),
          currentPageId: editor.getCurrentPageId(),
          userId: 'user-id',
          userName: 'Testing it',
          cursor: {
            x: 0,
            y: 0,
            type: 'default',
            rotation: 0,
          },
          chatMessage: 'testing this chat message',
        })

        editor.store.mergeRemoteChanges(() => {
          editor.store.put([peerPresence])
        })
      }}
    />
  )
}

// How does our server handle assets like images and videos?
const multiplayerAssets: TLAssetStore = {
  // to upload an asset, we prefix it with a unique id, POST it to our worker, and return the URL
  async upload(_asset, file) {
    const id = uniqueId()

    const objectName = `${id}-${file.name}`
    const url = `${WORKER_URL}/uploads/${encodeURIComponent(objectName)}`

    const response = await fetch(url, {
      method: 'PUT',
      body: file,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload asset: ${response.statusText}`)
    }

    return url
  },
  // to retrieve an asset, we can just use the same URL. you could customize this to add extra
  // auth, or to serve optimized versions / sizes of the asset.
  resolve(asset) {
    return asset.props.src
  },
}

// How does our server handle bookmark unfurling?
async function unfurlBookmarkUrl({
  url,
}: { url: string }): Promise<TLBookmarkAsset> {
  const asset: TLBookmarkAsset = {
    id: AssetRecordType.createId(getHashForString(url)),
    typeName: 'asset',
    type: 'bookmark',
    meta: {},
    props: {
      src: url,
      description: '',
      image: '',
      favicon: '',
      title: '',
    },
  }

  try {
    const response = await fetch(
      `${WORKER_URL}/unfurl?url=${encodeURIComponent(url)}`,
    )
    const data = await response.json()

    asset.props.description = data?.description ?? ''
    asset.props.image = data?.image ?? ''
    asset.props.favicon = data?.favicon ?? ''
    asset.props.title = data?.title ?? ''
  } catch (e) {
    console.error(e)
  }
  return asset
}
