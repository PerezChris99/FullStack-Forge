import React, { useState } from 'react';
import './App.css';

// A simple functional component
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// A component with state using useState hook
function Counter() {
  // Initialize state with useState hook
  const [count, setCount] = useState(0);
  
  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// A component with a form
function NameForm() {
  const [name, setName] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedName(name);
  };
  
  return (
    <div className="form-container">
      <h2>Form Example</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name"
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {submittedName && <p>Hello, {submittedName}!</p>}
    </div>
  );
}

// A component with conditional rendering
function ConditionalRender() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
    <div className="conditional-container">
      <h2>Conditional Rendering</h2>
      {isLoggedIn ? (
        <div>
          <p>Welcome back, User!</p>
          <button onClick={() => setIsLoggedIn(false)}>Log Out</button>
        </div>
      ) : (
        <div>
          <p>Please log in to continue</p>
          <button onClick={() => setIsLoggedIn(true)}>Log In</button>
        </div>
      )}
    </div>
  );
}

// A component with a list
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: true },
    { id: 2, text: 'Build a React app', completed: false },
    { id: 3, text: 'Deploy the app', completed: false }
  ]);
  
  const [newTodo, setNewTodo] = useState('');
  
  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    const newTodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false
    };
    
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  return (
    <div className="todo-container">
      <h2>Todo List</h2>
      
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button type="submit">Add</button>
      </form>
      
      <ul className="todo-list">
        {todos.length === 0 ? (
          <li className="empty-state">No todos yet! Add one above.</li>
        ) : (
          todos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
      
      <div className="todo-stats">
        <p>{todos.filter(todo => todo.completed).length} completed / {todos.length} total</p>
      </div>
    </div>
  );
}

// Main App component
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Basics</h1>
        <p>Exploring the fundamental concepts of React</p>
      </header>
      
      <main>
        <section className="component-section">
          <h2>Basic Component with Props</h2>
          <div className="component-demo">
            <Welcome name="Developer" />
          </div>
          <div className="component-code">
            <pre>{`
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Welcome name="Developer" />
            `}</pre>
          </div>
        </section>
        
        <section className="component-section">
          <h2>Component with State</h2>
          <div className="component-demo">
            <Counter />
          </div>
          <div className="component-code">
            <pre>{`
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}
            `}</pre>
          </div>
        </section>
        
        <section className="component-section">
          <h2>Form Handling</h2>
          <div className="component-demo">
            <NameForm />
          </div>
        </section>
        
        <section className="component-section">
          <h2>Conditional Rendering</h2>
          <div className="component-demo">
            <ConditionalRender />
          </div>
        </section>
        
        <section className="component-section">
          <h2>Lists and Keys</h2>
          <div className="component-demo">
            <TodoList />
          </div>
        </section>
      </main>
      
      <footer>
        <p>Created for FullStack Forge - React Basics</p>
      </footer>
    </div>
  );
}

export default App;
