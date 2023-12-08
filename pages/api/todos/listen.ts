import type { NextApiRequest, NextApiResponse } from 'next';
import { TodoService } from '@/app/todo_service';
import { Message } from '@/app/publish';
import { buffer } from 'stream/consumers';
import { ErrorResponse } from '@/app/models/error_response';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Object | ErrorResponse>) {
  try {
    const data = Buffer.from(req.body.message.data, "base64").toString().trim();
    const message = JSON.parse(data) as Message;
    await TodoService.process(message);
    res.status(200).json(message);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({message: error.message});
      return
    }
    res.status(500).json({message: new Error(error as string)});
  }

}
