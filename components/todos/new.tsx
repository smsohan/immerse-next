import { FormEvent, useEffect, useState } from 'react';
import "@/app/globals.css";

export interface NewToDoProps {
    onCreate: (err: Error | undefined, todo: Todo | undefined) => void
}
export default function NewTodo(props: NewToDoProps) {
    const [title, setTitle] = useState<string>("");

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
        if (response.status === 200) {
            const createdTodo = await response.json() as Todo;
            props.onCreate(undefined, createdTodo);
            setTitle("");
        } else {
            const error = await response.json() as Error;
            props.onCreate(error, undefined);
        }
    }

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 lg:gap-1 p-2'>
            <form className='w-full col-span-2 lg:col-span-4' onSubmit={e => addTodo(e)}>
                <div className='flex items-center border-b border-teal-500 py-2'>
                    <input className="appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none" type="text"
                        onChange={e => setTitle(e.target.value)} value={title} placeholder='e.g. call the phamacy'
                        aria-label="Todo title"/>
                        <button className='flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded' type="submit">Add</button>
                </div>
            </form>
        </div>
    )
}
