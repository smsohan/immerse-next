import { FormEvent, useEffect, useState } from 'react';
import "@/app/globals.css";

export interface EditTodoProps {
    todo: Todo,
    onUpdate: (err: Error | undefined, todo: Todo | undefined) => void
}
export default function EditTodo(props: EditTodoProps) {
    const [title, setTitle] = useState<string>(props.todo.title);

    const updateTodo = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch("/api/todos/" + props.todo.id, {
            method: "put",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...props.todo,
                title
            })
        });
        if (response.status === 200) {
            const createdTodo = await response.json() as Todo;
            props.onUpdate(undefined, createdTodo);
            setTitle("");
        } else {
            const error = await response.json() as Error;
            props.onUpdate(error, undefined);
        }
    }

    return (
        <div>
            <form className='w-full max-w-sm' onSubmit={e => updateTodo(e)}>
                <div className='flex items-center border-b border-teal-500 py-2'>
                    <input className="appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none" type="text"
                        onChange={e => setTitle(e.target.value)} value={title} placeholder='e.g. call the phamacy'
                        aria-label="Todo title"/>
                        <button className='flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded' type="submit">Update</button>
                </div>
            </form>
        </div>
    )
}
