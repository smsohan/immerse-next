import NewTodo from '@/components/todos/new';
import Todo from '@/components/todos/todo';
import { useEffect, useState } from 'react';
import '@/app/globals.css'
import EditTodo from '@/components/todos/edit';

export default function Todos() {

    const [todos, setTodos] = useState<Todo[]>([])
    const [visits, setVisits] = useState<number>(0)
    const [error, setError] = useState<Error | undefined>()
    const [todoForEdit, setTodoForEdit] = useState<Todo | undefined>(undefined);

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

        if (todo) {
            setTodos([...todos, todo])
        }
    }

    const todoDeleted = (err: Error | undefined, todo: Todo | undefined) => {
        console.log("todoDeleted: " + err?.message + todo?.id)
        setError(err);

        if (todo) {
            setTodos(todos.filter(t => t.id !== todo.id))
        }
    }

    const editTodo = (todo: Todo): void => {
        console.log("Editing " + todo.id);
        setTodoForEdit(todo);
    }

    const todoUpdated = (err: Error | undefined, todo: Todo | undefined): void => {
        setError(err);
        if (todo) {

            const updated = todos.map(t => {
                if (t.id === todo.id) {
                    return todo;
                }
                return t;
            });

            setTodos(updated);
            setTodoForEdit(undefined);
        }
    }

    console.log("Rendering " + todoForEdit?.title);
    return (<div className='m-4'>
        <h1 className='text-3xl font-bold mb-8'>Todos</h1>
        <div>{error && error.message}</div>
        <div className='mb-8'>
            {
                todoForEdit ?
                    <EditTodo todo={todoForEdit} onUpdate={todoUpdated}></EditTodo> :
                    <NewTodo onCreate={todoCreated}></NewTodo>
            }
        </div>
        <div>
            {todos.map(todo =>
                <Todo key={todo.id} todo={todo} onDelete={todoDeleted} onEdit={editTodo} />
            )}
            <div className='mt-4'>This page is visited {visits} times</div>
        </div>
    </div>)
}
