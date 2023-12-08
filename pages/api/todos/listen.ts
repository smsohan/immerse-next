import type { NextApiRequest, NextApiResponse } from 'next';
import { TodoService } from '@/app/todo_service';
import { Message } from '@/app/publish';
import { buffer } from 'stream/consumers';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Object | Error>) {
  try {
    const data = req.body.data as Buffer;
    const message = JSON.parse(data.toString("base64")) as Message;
    await TodoService.process(message);
    res.status(200).json({});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error);
    }
  }

}
