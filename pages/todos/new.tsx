import { useEffect, useState } from 'react';

export default function NewTodo() {
    const [title, setTitle] = useState<string>("");
    const [id, setId] = useState<undefined | number>(undefined);

    const addTodo = async (e: SubmitEvent) => {
        e.preventDefault();
        alert("Creating " + title);
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
            setId(createdTodo.id);
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