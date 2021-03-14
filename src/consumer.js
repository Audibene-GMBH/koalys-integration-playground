import Pulsar from 'pulsar-client'
import { v4 as uuidv4 } from 'uuid'
import {config} from './config.js'

const auth = new Pulsar.AuthenticationToken({
  token: config.pulsar.token
});

const pulsarClient = new Pulsar.Client({
  serviceUrl: config.pulsar.brokerURL,
  authentication: auth,
  operationTimeoutSeconds: 30,
});

const consumer = await pulsarClient.subscribe({
    //the topic to connect to
    topic: config.pulsar.topic,
    //name of subscription the consumer belongs to, usecase see :"subscriptionType"
    subscription: config.app.name,
    //name of individual consumer within the subscription, must be unique, hence the uuid
    consumerName: `${config.app.name}-${uuidv4()}`,
    //starts at the last index of the event store, use "Earliest" if you want to start from the top (for example if you want to restore state from CDC events)
    subscriptionInitialPosition: 'Latest',
    //best for high-throughput consumption of messages with several horizontally scaled pods / services, multiuple consumers in a subscription receive messages round-robin, but ordering is guaranteed if you use proper message keys
    subscriptionType: 'KeyShared'
  });

//consuming 10 latest messages, then closing the consumer & client
for (let i = 0; i < 10; i++) {
const msg = await consumer.receive();
const body = JSON.parse(msg.getData().toString())
console.log(`New ${body.event_type} event with id ${body.event_id} for account ${msg.getPartitionKey()} received, printing below --------------`)
console.log(body);
console.log('End of message ------------------')
consumer.acknowledge(msg);
}

await consumer.close();
await pulsarClient.close();