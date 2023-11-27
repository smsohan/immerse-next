import NewTodo from '@/components/todos/new';
import { useEffect, useState } from 'react';

export default function Todos() {

    const [todos, setTodos] = useState<Todo[]>([])
    const [visits, setVisits] = useState<number>(0)
    const [error, setError] = useState<Error | undefined>()

    useEffect(() => {
        fetch("/api/todos")
            .then((r) => r.json())
            .then(t => {
                setTodos(t)
            });

        fetch("/api/visits")
            .then((r) => r.json())
            .then(v => setVisits(v.visits));
    }, [])


    const todoCreated = (err: Error | undefined, todo: Todo | undefined) => {
        setError(err);

        if(todo){
            setTodos([...todos, todo])
        }
    }

    return (<div>
        <h1>Todos</h1>
        <div>{error && error.message}</div>
        <NewTodo onCreate={todoCreated}></NewTodo>
        <ol>
            {todos.map(todo =>
                <li key={todo.id}> {todo.title}</li>
            )}
        </ol>
        <p>This page is visited {visits} times</p>
    </div>)
}
