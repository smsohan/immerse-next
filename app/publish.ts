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

export interface MessagePayload {
    messageId: string
    data: string
}
export function createMessageFromPayload(payload: MessagePayload): Message{
    const data = Buffer.from(payload.data, "base64").toString().trim();
    const message = JSON.parse(data) as Message;
    message.messageId = payload.messageId;
    return message;
}
export default async function publish(message: Message): Promise<void>{
    const pubsub = new PubSub({projectId: process.env.PROJECT_ID});
    const [topic] = await pubsub.topic(process.env.PUBSUB_TOPIC).get({autoCreate: true})
    message.createdAt = new Date();
    console.log("publishing "+ JSON.stringify(message));
    const messageId = await topic.publishMessage({data: Buffer.from(JSON.stringify(message))});
    console.log("Published message with Id " + messageId);
}