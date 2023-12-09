import { ResultSetHeader } from "mysql2/promise";
import pool from "./db";
import publish, { Message } from "./publish";

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

            pool.execute<ResultSetHeader>("INSERT INTO todos (title) VALUES (?)", [todo.title], async (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                todo.id = res.insertId;
                await publish({
                    objectType: "Todo",
                    eventType: "create",
                    id: todo.id,
                    title: todo.title
                });
                console.log("After publish");
                resolve(todo);
            });
        });
    }

    static async delete(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            pool.execute<ResultSetHeader>("DELETE FROM todos WHERE id=?", [id], async(err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                await publish({
                    objectType: "Todo",
                    eventType: "delete",
                    id: id
                });

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

            pool.execute<ResultSetHeader>("UPDATE todos SET title=? WHERE id=?", [todo.title, todo.id], async(err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                await publish({
                    objectType: "Todo",
                    eventType: "update",
                    id: todo.id!,
                    title: todo.title
                });
                resolve(todo);
            });
        });
    }
}