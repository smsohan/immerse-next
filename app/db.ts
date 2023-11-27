import { env } from 'process';
import { readFile } from 'fs/promises';
import { createPool } from 'mysql2';
import { Sequelize } from 'sequelize';

const password = (await readFile(env.MYSQL_PASSWORD_FILE!, { encoding: "utf-8" })).toString().trim();
let options = {};

if (process.env.MYSQL_SOCKET) {
    options = { socketPath: process.env.MYSQL_SOCKET };
} else {
    const port = process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306
    options = { host: process.env.MYSQL_HOST, port: port };
}
const sequelize = new Sequelize(process.env.MYSQL_DB!, process.env.MYSQL_USER!, password, {
    dialect: 'mysql',
    dialectOptions: options
});

export default sequelize;