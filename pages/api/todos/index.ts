import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../app/db';
import { TodoService } from '@/app/todo_service';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Todo[] | Error>) {
  try {
    const todos = await TodoService.FindAll();
    res.status(200).json(todos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error);
    }
  }

}
