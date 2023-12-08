const {PubSub} = require('@google-cloud/pubsub');
require('dotenv').config();

(async function subscribe(){
    const pubsub = new PubSub({projectId: process.env.PROJECT_ID});
    const topic = await pubsub.topic(process.env.PUBSUB_TOPIC);
    const sub = await topic.subscription(process.env.PUBSUB_SUBSCRIPTION);

    console.log("Listening...");
    sub.on("message", (message) => {
        console.log("Received:");
        console.log(message.data.toString());
    });
    sub.on("error", (error) => {
        console.error("Failed to start subscription " + error);
    })
    setTimeout(() => {
        sub.removeListener('message');
    }, 3600 * 1000);
})();
