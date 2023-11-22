import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'process';
import { readFile } from 'fs/promises';
import { createPool } from 'mysql2';

const createTcpPool = async function(){
  const password = (await readFile(env.MYSQL_PASSWORD_FILE!, {encoding: "utf-8"})).toString().trim();

  let dbConfig: any = {
    user: process.env.MYSQL_USER,
    password: password,
    database: env.MYSQL_DB
  };

  if(process.env.MYSQL_SOCKET){
    dbConfig.socketPath = process.env.MYSQL_SOCKET;
  } else {
    const port = process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306
    dbConfig = {
      ...dbConfig,
      host: process.env.MYSQL_HOST,
      port: port
    }
  }
  return createPool(dbConfig);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const dbPool = await createTcpPool();

  dbPool.query('SELECT * FROM todos;', (err: any, results: any[]) => {
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
