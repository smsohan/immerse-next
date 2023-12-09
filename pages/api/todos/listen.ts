import type { NextApiRequest, NextApiResponse } from 'next';
import { Message } from '@/app/publish';
import { ErrorResponse } from '@/app/models/error_response';
import TodoEventHandler from '@/app/todo_event_handler';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Object | ErrorResponse>) {
  try {
    const data = Buffer.from(req.body.message.data, "base64").toString().trim();
    const message = JSON.parse(data) as Message;
    message.messageId = req.body.message.messageId;
    await TodoEventHandler.process(message);
    res.status(200).json(message);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return
    }
    res.status(500).json({ message: new Error(error as string) });
  }

}
