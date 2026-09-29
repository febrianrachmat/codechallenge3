import { useState, useEffect, useMemo, useCallback } from 'react'

function loadTodos() {
  try {
    const saved = localStorage.getItem('todos')
    if (!saved) return []
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function App() {
  const [todos, setTodos] = useState(loadTodos)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback(() => {
    if (input.trim() === '') {
      alert('Please enter a todo')
      return
    }

    const newTodo = {
      id: crypto.randomUUID(),
      text: input,
      completed: false,
      createdAt: new Date().toISOString()
    }

    setTodos(prev => [...prev, newTodo])
    setInput('')
  }, [input])

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => String(todo.id) !== String(id)))
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      String(todo.id) === String(id) ? { ...todo, completed: !todo.completed } : todo
    ))
  }, [])

  const onInputChange = useCallback((event) => {
    setInput(event.target.value)
  }, [])

  const onInputKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      addTodo()
    }
  }, [addTodo])

  const onFilter = useCallback((event) => {
    setFilter(event.currentTarget.value)
  }, [])

  const onToggle = useCallback((event) => {
    toggleTodo(event.currentTarget.value)
  }, [toggleTodo])

  const onDelete = useCallback((event) => {
    deleteTodo(event.currentTarget.value)
  }, [deleteTodo])
  
  const filteredTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter(todo => !todo.completed)
    }
    if (filter === 'completed') {
      return todos.filter(todo => todo.completed)
    }
    return todos
  }, [todos, filter])
  
  const stats = useMemo(() => {
    const completed = todos.filter(todo => todo.completed).length
    return {
      total: todos.length,
      completed,
      active: todos.length - completed
    }
  }, [todos])
  
  return (
    <div className="app">
      <h1>My Todo List</h1>
      
      <div className="input-section">
        <label htmlFor="todo-input" className="visually-hidden">
          What needs to be done?
        </label>
        <input
          id="todo-input"
          type="text"
          value={input}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          placeholder="What needs to be done?"
        />
        <button type="button" onClick={addTodo}>Add</button>
      </div>

      <div className="filters" role="group" aria-label="Filter todos">
        <button
          type="button"
          value="all"
          onClick={onFilter}
          className={filter === 'all' ? 'is-active' : undefined}
          aria-pressed={filter === 'all'}
        >
          All
        </button>
        <button
          type="button"
          value="active"
          onClick={onFilter}
          className={filter === 'active' ? 'is-active' : undefined}
          aria-pressed={filter === 'active'}
        >
          Active
        </button>
        <button
          type="button"
          value="completed"
          onClick={onFilter}
          className={filter === 'completed' ? 'is-active' : undefined}
          aria-pressed={filter === 'completed'}
        >
          Completed
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.length === 0 && (
          <li className="empty-state">No todos to show.</li>
        )}
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              value={todo.id}
              checked={todo.completed}
              onChange={onToggle}
              aria-label={
                todo.completed
                  ? `Mark "${todo.text}" as active`
                  : `Mark "${todo.text}" as complete`
              }
            />
            <span>{todo.text}</span>
            <button
              type="button"
              className="delete-btn"
              value={todo.id}
              onClick={onDelete}
              aria-label={`Delete ${todo.text}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="stats" aria-live="polite">
        <p>Total: {stats.total} | Active: {stats.active} | Completed: {stats.completed}</p>
      </div>
    </div>
  )
}

export default App
