/// <reference path="../node_modules/@google-cloud/pubsub/build/src/index.d.ts" />
const {PubSub} = require('@google-cloud/pubsub');

export interface Message {
    objectType: "Todo"
    eventType: "create" | "update" | "delete"
    title: string
    previousTitle?: string
}
export default async function(message: Message): Promise<void>{
    const pubsub = new PubSub({projectId: process.env.PROJECT_ID});
    const topic = await pubsub.topic(process.env.PUBSUB_TOPIC);
    const messageId = await topic.publishMessage({data: Buffer.from(JSON.stringify(message))});
    console.log("Published message with Id " + messageId);
}