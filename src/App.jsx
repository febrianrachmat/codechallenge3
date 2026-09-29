import { useState, useEffect, useMemo } from 'react'

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
  // Issue 2: State management bisa lebih baik
  const [todos, setTodos] = useState(loadTodos)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])
  
  // Issue 5: Function yang tidak di-memoize, re-create setiap render
  const addTodo = () => {
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
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }
  
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
  
  // Issue 10: Inline event handler dengan arrow function (re-create setiap render)
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
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addTodo()
            }
          }}
          placeholder="What needs to be done?"
        />
        <button type="button" onClick={addTodo}>Add</button>
      </div>

      <div className="filters" role="group" aria-label="Filter todos">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'is-active' : undefined}
          aria-pressed={filter === 'all'}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'is-active' : undefined}
          aria-pressed={filter === 'active'}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
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
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
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
              onClick={() => deleteTodo(todo.id)}
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
