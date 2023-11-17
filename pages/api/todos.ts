import type { NextApiRequest, NextApiResponse } from 'next';
import { env, title } from 'process';
import { createConnection, createPool } from 'mysql2';
import { root } from 'postcss';
import { Rowdies } from 'next/font/google';
import { AuthTypes, Connector } from '@google-cloud/cloud-sql-connector';

// if (env.NODE_ENV === 'development') {
//   const connection = createConnection({
//     host: env.MYSQL_HOST || 'localhost',
//     user: env.MYSQL_USER || 'root',
//     password: env.MYSQL_PASSWORD,
//     database: env.MYSQL_DB || 'immerse_next'
//   });
// } else {
//   const connector = new Connector();
//   const clientOpts = await connector.getOptions({
//     instanceConnectionName: process.env.MYSQL_CONNECTION_NAME!,
//     authType: AuthTypes.IAM
// });

//  createPool
// }

// connection.connect((err: any) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//   } else {
//     console.log('Connected to database successfully');
//   }
// });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  res.status(200).json({MYSQL_CONNECTION_NAME: env.MYSQL_CONNECTION_NAME,
    MYSQL_DB: env.MYSQL_DB
  })

  // connection.query('SELECT * FROM todos;', (err: any, results: any[]) => {
  //   if (err) {
  //     console.error('Error executing query:', err);
  //     res.status(500).json({ error: err });
  //   } else {
  //     const todos: Todo[] = results.map(r => {
  //       return { title: r.title, id: r.id };
  //     })
  //     res.status(200).json(todos);
  //   }
  // });
}