import type { NextApiRequest, NextApiResponse } from 'next';
import { TodoService } from '@/app/todo_service';

export default async function handler(req: NextApiRequest, response: NextApiResponse<Todo | Error>) {
  const todo: Todo = req.body

  try {
    const createdTodo = await TodoService.create(todo);
    response.status(200).json(createdTodo);
  } catch (err) {
    if (err instanceof Error) {
      console.log("ERRORRR " + err.message);
      response.status(400).json({ name: err.name, message: err.message });
    }
  }
}
