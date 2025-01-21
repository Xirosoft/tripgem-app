import Pusher from 'pusher-js'

let pusherInstance = null

const initializePusher = () => {
  if (pusherInstance) return pusherInstance

  console.log('Initializing Pusher...')
  pusherInstance = new Pusher('21a8e898a0d7e6578c45', {
    cluster: 'ap1',
    forceTLS: true,
    enabledTransports: ['ws', 'wss', 'xhr_streaming', 'xhr_polling'],
  })

  return pusherInstance
}

/**
 * Unified method to handle both subscribing to and triggering events on a Pusher channel.
 * @param {string} channelName - The name of the Pusher channel.
 * @param {string} eventName - The event name to subscribe to or trigger.
 * @param {Object} options - Options object with optional `callback` or `data`.
 *                           Use `callback` for subscription and `data` for triggering events.
 */
export const TgHandlePusherChannel = (channelName, eventName, options = {}) => {
  const { callback, data } = options
  const pusher = initializePusher()
  const channel = pusher.subscribe(channelName)

  if (callback) {
    // Subscribing to an event
    channel.bind(eventName, (eventData) => {
      console.log(`Pusher event received: ${eventName}`)
      callback(eventData)
    })

    channel.bind('pusher:subscription_succeeded', () => {
      console.log(`Subscription succeeded for channel: ${channelName}`)
    })

    channel.bind('pusher:subscription_error', (status) => {
      console.error(`Subscription error for channel ${channelName}:`, status)
    })
  } else if (data) {
    // Triggering an event
    channel.trigger(eventName.startsWith('client-') ? eventName : `client-${eventName}`, data)
    console.log(`Pusher event triggered: ${eventName}`, data)
  }
}

export const bindPusherEvents = (callback) => {
  const pusher = initializePusher()
  const channel = pusher.subscribe('permissions-updates')

  channel.bind('update', (data) => {
    console.log('Permissions update received:', data)
    callback(data)
  })
}
