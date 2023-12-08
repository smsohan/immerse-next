import type { NextApiRequest, NextApiResponse } from 'next';
import { TodoService } from '@/app/todo_service';
import { Message } from '@/app/publish';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Object | Error>) {
  try {
    const message = req.body as Message;
    const todos = await TodoService.process(message);
    res.status(200).json({});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error);
    }
  }

}
