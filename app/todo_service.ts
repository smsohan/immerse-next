import { ResultSetHeader } from "mysql2/promise";
import pool from "./db";

export class TodoService {

    static async FindAll(): Promise<Todo[]> {
        return new Promise<Todo[]>((resolve, reject) => {
            pool.query("SELECT * FROM todos;", (err: any, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    const todos: Todo[] = results.map(r => {
                        return { title: r.title, id: r.id };
                    })
                    resolve(todos);
                }
            });
        });
    }

    static async create(todo: Todo): Promise<Todo> {

        return new Promise<Todo>((resolve, reject) => {
            if (todo.title?.length === 0) {
                reject({
                    name: "Invalid Request",
                    message: "Todo title can't be blank"
                });
                return;
            }

            pool.execute<ResultSetHeader>("INSERT INTO todos (title) VALUES (?)", [todo.title], (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                todo.id = res.insertId;
                resolve(todo);
            });
        });
    }

    static async delete(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            pool.execute<ResultSetHeader>("DELETE FROM todos WHERE id=?", [id], (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    static async update(todo: Todo): Promise<Todo> {

        return new Promise<Todo>((resolve, reject) => {
            if (todo.title?.length === 0) {
                reject({
                    name: "Invalid Request",
                    message: "Todo title can't be blank"
                });
                return;
            }

            pool.execute<ResultSetHeader>("UPDATE todos SET title=? WHERE id=?", [todo.title, todo.id], (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(todo);
            });
        });
    }
}