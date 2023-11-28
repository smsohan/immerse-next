import { env } from 'process';
import { readFile } from 'fs/promises';
import { createPool } from 'mysql2';

const connectToDB = async function(){
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

const pool = await connectToDB();

export default pool;