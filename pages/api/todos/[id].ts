import type { NextApiRequest, NextApiResponse } from 'next';
import { TodoService } from '@/app/todo_service';

export default async function handler(req: NextApiRequest, res: NextApiResponse<object | Todo | Error>) {
    const { id } = req.query;

    if (req.method === "DELETE") {
        try {
            const todos = await TodoService.delete(parseInt(id! as string, 10));
            res.status(200).json({});
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(error);
            }
        }
        return;
    }
    if (req.method === "PUT") {
        try {
            const todo = req.body as Todo;
            const todos = await TodoService.update(todo);
            res.status(200).json(todo);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json(error);
            }
        }
        return;
    }

}
