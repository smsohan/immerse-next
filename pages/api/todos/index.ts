import type { NextApiRequest, NextApiResponse } from 'next';
import { TodoService } from '@/app/todo_service';
import prom from 'prom-client';
import { constrainedMemory } from 'process';

prom.register.clear();
prom.collectDefaultMetrics({
  prefix: "immerese_next_",
});

const metrics = new prom.Counter({
  name: "immerse_next_api_todos",
  help: "Total call to api/todos endpoint",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse<Todo[] | Error>) {
  try {
    const todos = await TodoService.FindAll();
    metrics.inc();
    res.status(200).json(todos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error);
    }
  }

}
