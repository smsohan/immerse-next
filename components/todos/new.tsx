import { FormEvent, useEffect, useState } from 'react';

export interface NewToDoProps {
    onCreate: (err: Error | undefined, todo: Todo | undefined) => void
}
export default function NewTodo(props: NewToDoProps) {
    const [title, setTitle] = useState<string>("");
    const [id, setId] = useState<undefined | number>(undefined);

    const addTodo = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const todo: Todo = { title };
        const response = await fetch("/api/todos/create", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
        });
        if(response.status === 200){
            const createdTodo = await response.json() as Todo;
            props.onCreate(undefined, createdTodo);
        } else {
            const error = await response.json() as Error;
            props.onCreate(error, undefined);
        }
    }

    return (
        <div>
            {id && <span>ID: {id}</span>}
            <form onSubmit={e => addTodo(e)}>
                <input type="text" onChange={e => setTitle(e.target.value) } placeholder='e.g. call the phamacy' />
                <button type="submit">Add</button>
            </form>
        </div>
    )
}
