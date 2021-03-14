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


const producer = await pulsarClient.createProducer({
    topic: config.pulsar.topic,
    producerName: `${config.app.name}--${uuidv4()}`,
    messageRoutingMode: 'RoundRobinPartition',
    maxPendingMessages: 1000,
    maxPendingMessagesAcrossPartitions: 10000,
    sendTimeoutMs: 500,
    batchingEnabled: false, // set to true if you expect high number of messages and want to reduce load on producer
    batchingMaxPublishDelayMs: 50,
    batchingMaxMessages: 1000,
    hashingScheme: 'Murmur3_32Hash'
});

//producing 10 messages, then closing the producer & client
for (let i = 0; i < 10; i++) {

    //this is an example of an create event for a customer account, as our account service would send it
    let customerEvent = {
      event_id: uuidv4(),
      //possible event types: account.created, account.updated, account.deleted
      event_type:'account.created',
      event_dispatched_at: Date.now(),
      country:'US',
      data:{
        id: uuidv4(),
        gid: uuidv4(),
        dob: Date.now(),
        salutation: "MR",
        firstname: "Max",
        lastname: "Mustermann",
        gender: "M",
        photo_url: "https://pictures.com/greatpicture.jpeg",
        language: "en-US",
        timezone: "America/Denver",
        country: "US",
        phone: "122390909",
        email: "max.mustermann@gmail.com",
        created_at: Date.now(),
        updated_at: Date.now(),
        is_deleted: false,
        customer: {
          is_teleaudiology: true,
          nav_debtor_number: 'CUST-000001',
          billing_street: 'AwesomeStreet 2020',
          billing_city: 'AwesomeCity',
          billing_state: 'BestState',
          billing_zip: '12345',
          billing_country: 'US',
          shipping_street: 'AwesomeStreet 2020',
          shipping_city: 'AwesomeCity',
          shipping_state: 'BestState',
          shipping_zip: '12345',
          shipping_country: 'US'
        }
      }
    }


    let pulsarMessage = {
      // setting partitionKey to primary key of entity we are sending, guarantees all messages for this entity are sent to the same partition, thereby enabling consumption in order
      partitionKey: customerEvent.data.id,
      eventTimestamp: Date.now(),
      //data needs to be a Buffer
      data: Buffer.from(JSON.stringify(customerEvent))
    }

    producer.send(pulsarMessage);
    console.log(`Sent message for event ${customerEvent.event_id}`);
}

  await producer.flush();
  await producer.close();
  await pulsarClient.close();