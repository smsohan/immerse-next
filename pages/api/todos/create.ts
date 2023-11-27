import type { NextApiRequest, NextApiResponse } from 'next';
import pool from './db';
import { ResultSetHeader } from 'mysql2';

export default async function handler(req: NextApiRequest, response: NextApiResponse<Todo | Error>) {
  const todo: Todo = req.body
  pool.execute<ResultSetHeader>("INSERT INTO todos (title) VALUES (?)", [todo.title], (err, res) => {
    if(err){
        console.log("ERRORRR " + err.message);
        response.status(400).json({name: err.name, message: err.message});
        return;
    }
    todo.id = res.insertId;
    response.status(200).json(todo);
  });
}
