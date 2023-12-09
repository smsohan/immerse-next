import { MouseEvent } from "react";
import "@/app/globals.css";

export interface TodoProps {
    todo: Todo,
    onDelete: (error: Error | undefined, todo: Todo | undefined) => void,
    onEdit: (todo: Todo) => void
}
export default function Todo(props: TodoProps) {
    const deleteTodo = async (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const response = await fetch("/api/todos/" + props.todo.id,
            {
                method: "delete"
            })
        if (response.status === 200) {
            props.onDelete(undefined, props.todo);
        } else {
            const error = await response.json() as Error;
            props.onDelete(error, undefined);
        }
    }

    const editTodo = (event: MouseEvent<HTMLAnchorElement>): void => {
        event.preventDefault();
        props.onEdit(props.todo);
    }
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 lg:gap-2 p-2" key={props.todo.id}>
            <div className="lg:col-span-3 p-1">
                #{props.todo.id} {props.todo.title}
            </div>
            <div className="p-1 text-blue-600 hover-underline text-right">
                <a className="cursor-pointer mr-4" onClick={editTodo}>Edit</a>
                <a className="cursor-pointer" onClick={deleteTodo}>Delete</a>
            </div>
        </div>
    );
}