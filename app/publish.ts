/// <reference path="../node_modules/@google-cloud/pubsub/build/src/index.d.ts" />
const {PubSub} = require('@google-cloud/pubsub');

export interface Message {
    objectType: "Todo"
    eventType: "create" | "update" | "delete"
    id: number
    title?: string
    createdAt?: Date
    messageId?: string
}
export default async function publish(message: Message): Promise<void>{
    const pubsub = new PubSub({projectId: process.env.PROJECT_ID});
    const topic = await pubsub.topic(process.env.PUBSUB_TOPIC);
    message.createdAt = new Date();
    console.log("publishing "+ JSON.stringify(message));
    const messageId = await topic.publishMessage({data: Buffer.from(JSON.stringify(message))});
    console.log("Published message with Id " + messageId);
}