import { params } from '../config/params'

// Imports the Google Cloud client library
import pubsub from '@google-cloud/pubsub'

const client = new pubsub.v1.SubscriberClient({
  projectId: params.projectId,
  keyFilename: params.keyFilename,
})

const subscription = client.subscriptionPath(
  params.projectId,
  params.subscription
)

var request = {
  subscription: subscription,
  maxMessages: params.maxMessages,
  returnImmediately: true,
}

// get a message
client
  .pull(request)
  .then((responses) => {
    var response = responses[0]
    if (response.receivedMessages.length === 0) {
      console.log('No new message')
      return null
    }

    const data = response.receivedMessages[0]
    // console.log(data)

    return {
      ackId: data.ackId,
      id: data.message.messageId,
      data: data.message.attributes,
      published:
        parseInt(data.message.publishTime.seconds) +
        data.message.publishTime.nanos / 1000000000,
    }
  })
  .then((message) => {
    if (message) {
      console.log(`Received message #${message.id}`)
      console.log(message)
      // acknowledge message
      var request = {
        subscription: subscription,
        ackIds: [message.ackId],
      }
      client.acknowledge(request).catch((err) => {
        console.error(err)
      })
    }
  })
  .catch((err) => {
    console.error(err)
  })
