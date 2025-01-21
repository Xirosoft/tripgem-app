import Pusher from 'pusher-js'
let pusherInstance = null

export const initializePusher = () => {
  if (pusherInstance) return pusherInstance

  console.log('Initializing Pusher...')

  pusherInstance = new Pusher('21a8e898a0d7e6578c45', {
    cluster: 'ap1',
    forceTLS: true,
    enabledTransports: ['ws', 'wss', 'xhr_streaming', 'xhr_polling'],
  })

  return pusherInstance
}

export const subscribeToChannel = (channelName, eventName, callback) => {
  const pusher = initializePusher()
  const channel = pusher.subscribe(channelName)

  channel.bind(eventName, (data) => {
    console.log(`Pusher event received: ${eventName}`)
    callback(data)
  })

  channel.bind('pusher:subscription_succeeded', () => {
    console.log('Pusher subscription succeeded')
  })

  channel.bind('pusher:subscription_error', (status) => {
    console.error('Pusher subscription error:', status)
  })
}

export const triggerPusherEvent = (channelName, eventName, data) => {
  const pusher = initializePusher()
  const channel = pusher.subscribe(channelName)
  channel.trigger(`client-${eventName}`, data) // Ensure the event name is prefixed with 'client-'
}
