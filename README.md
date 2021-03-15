# Pulsar Integration Playground

This is an example project & small playground to get familar with pulsar (https://pulsar.apache.org) It contains a very barebones implementation of a pulsar producer & consumer, with some best practice settings & explanations. 

## Setup

The pulsar-node module that is used wraps the pulsar C++ library. This library needs to be installed on the local machine for the project to run successfully.

Mac: ``` brew install libpulsar```

Other OS: https://pulsar.apache.org/docs/en/client-libraries-cpp/#compilation

You will need a topic on a pulsar cluster to connect to, you can run your own locally with docker-compose, or set up a free cluster here: https://streamnative.io/

After you have set up your cluster, topics & access credentials, please fill out the placeholders in ```src/config.js``` with the respective values.

## How to run

1. ```npm install```

2. In one terminal window: ```node src/consumer.js```

3. In a seperate terminal window ```node src/producer.js```

The producer will produce 10 new messages, which will be consumed and printed to the console by the consumer. Both will close and terminate the connection to the pulsar cluster after completion.


