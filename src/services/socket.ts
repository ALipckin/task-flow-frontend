import { useNotifier } from '@/composables/useNotifier'

let socket: WebSocket | null = null
let onMessageCallback: ((data: Record<string, unknown>) => void) | null = null

export function initSocket(url: string) {
  const { notify } = useNotifier()

  socket = new WebSocket(url)
  const token = "Bearer " + localStorage.getItem('token');

  socket.onopen = () => {
    console.log('[WebSocket] Connected')

    if (token) {
      const authMessage = JSON.stringify({
        type: 'authenticate',
        token: token,
      })
      socket?.send(authMessage)
      console.log('[WebSocket] Sent auth token')
    } else {
      console.warn('[WebSocket] No token found, skipping authentication')
    }
  }


  socket.onmessage = (event: MessageEvent) => {
    try {
      const raw = JSON.parse(event.data) as Record<string, unknown>
      console.log('[WebSocket] Parsed message:', raw)

      onMessageCallback?.(raw)
      const messageText = formatSocketMessage(raw)
      notify(messageText, 'info')
    } catch (e) {
      console.error('[WebSocket] Failed to parse message:', event.data, e)
    }
  }

  socket.onclose = () => {
    console.warn('[WebSocket] Disconnected. Reconnecting...')
    setTimeout(() => initSocket(url), 3000)
  }
}

export function onMessage(callback: (data: Record<string, unknown>) => void) {
  onMessageCallback = callback
}

export function formatSocketMessage(data: Record<string, unknown>): string {
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}
