import type { NextApiRequest, NextApiResponse } from 'next';
import pool from './db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  pool.query("SELECT * FROM todos;", (err: any, results: any[]) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: err });
    } else {
      const todos: Todo[] = results.map(r => {
        return { title: r.title, id: r.id };
      })
      res.status(200).json(todos);
    }
  });
}
