import { useEffect, useState } from 'react';

export default function Todos() {

    const [todos, setTodos] = useState<Todo[]>([])
    const [visits, setVisits] = useState<number>(0)

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

    return (<div>
        <h1>Todos</h1>
        <ol>
            {todos.map(todo =>
                <li key={todo.id}> {todo.title}</li>
            )}
        </ol>
        <p>This page is visited {visits} times</p>
    </div>)
}
