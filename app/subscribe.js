const {PubSub} = require('@google-cloud/pubsub');
const { randomUUID } = require('crypto');
require('dotenv').config();

(async function subscribe(){
    const pubsub = new PubSub({projectId: process.env.PROJECT_ID});
    const [topic] = await pubsub.topic(process.env.PUBSUB_TOPIC).get({autoCreate: true});
    const [sub] = await topic.subscription(process.env.PUBSUB_SUBSCRIPTION).get({autoCreate: true});

    console.log("Listening...");
    sub.on("message", async (message) => {
        console.log("Received:");
        console.log(message.data.toString());

        const buff = Buffer.from(message.data.toString(), 'utf-8');
        const messagePayload = buff.toString('base64');
        const port = process.env.PORT || '3000';
        const url = `http://localhost:${port}/api/todos/listen`
        const body = JSON.stringify({ messageId: randomUUID().toString(), message: {data: messagePayload }});

        console.log(`sending ${body} to ${url}`)

        const response = await fetch(url, {
            body,
            method: 'POST',
            headers: {'Content-Type' : 'application/json'}
        })

        console.log(`Received response status: ${response.status}`);
    });
    sub.on("error", (error) => {
        console.error("Failed to start subscription " + error);
    })
    setTimeout(() => {
        sub.removeListener('message');
    }, 3600 * 1000);
})();
