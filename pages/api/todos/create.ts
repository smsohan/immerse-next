import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../app/db';
import { ResultSetHeader } from 'mysql2';
import { TodoService } from '@/app/todo_service';

export default async function handler(req: NextApiRequest, response: NextApiResponse<Todo | Error>) {
  const todo: Todo = req.body
  if (todo.title?.length === 0) {
    response.status(400).json({
      name: "Invalid Request",
      message: "Todo title can't be blank"
    });
    return;
  }
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
