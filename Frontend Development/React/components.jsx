/**
 * React Components
 * ===============
 * This file demonstrates how to create various types of React components.
 */

import React, { useState, useEffect, useContext } from 'react';

// Context API example
const ThemeContext = React.createContext('light');

// 1. Functional Component (with Hooks)
const Counter = () => {
  // useState Hook for state management
  const [count, setCount] = useState(0);
  
  // useEffect Hook for side effects
  useEffect(() => {
    document.title = `Count: ${count}`;
    
    // Cleanup function (similar to componentWillUnmount)
    return () => {
      document.title = 'React App';
    };
  }, [count]); // Only re-run when count changes
  
  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

// 2. Class Component
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0
    };
  }
  
  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(prevState => ({
        seconds: prevState.seconds + 1
      }));
    }, 1000);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render() {
    return (
      <div className="timer">
        <h2>Timer: {this.state.seconds} seconds</h2>
        <p>{this.props.message}</p>
      </div>
    );
  }
}

// 3. Component with Props
const Greeting = ({ name, role }) => {
  return (
    <div className="greeting">
      <h2>Hello, {name}!</h2>
      <p>Role: {role}</p>
    </div>
  );
};

// Default props
Greeting.defaultProps = {
  name: 'Guest',
  role: 'Visitor'
};

// 4. Component using Context API
const ThemedButton = () => {
  const theme = useContext(ThemeContext);
  
  return (
    <button
      className={`btn btn-${theme}`}
      style={{ background: theme === 'dark' ? '#333' : '#f0f0f0', 
               color: theme === 'dark' ? '#fff' : '#333' }}
    >
      I'm a {theme} theme button
    </button>
  );
};

// 5. Higher-Order Component (HOC)
const withLogging = (WrappedComponent) => {
  return class extends React.Component {
    componentDidMount() {
      console.log(`Component ${WrappedComponent.name} mounted`);
    }
    
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

// Using the HOC
const LoggedGreeting = withLogging(Greeting);

// 6. Component with Conditional Rendering
const UserStatus = ({ isLoggedIn, username }) => {
  return (
    <div className="user-status">
      {isLoggedIn ? (
        <p>Welcome back, {username}!</p>
      ) : (
        <p>Please log in to continue</p>
      )}
    </div>
  );
};

// 7. Component with List Rendering
const TodoList = ({ items }) => {
  return (
    <div className="todo-list">
      <h3>Todo Items</h3>
      {items.length === 0 ? (
        <p>No items to display</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.text}
              {item.completed && <span> ✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 8. Component with Form Handling
const SimpleForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    // Here you would typically send data to an API
    alert(`Form submitted!\nUsername: ${formData.username}\nEmail: ${formData.email}`);
  };
  
  return (
    <div className="simple-form">
      <h3>Registration Form</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

// 9. Component with useReducer for complex state
const TodoApp = () => {
  // Define reducer function
  const todoReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return [...state, {
          id: Date.now(),
          text: action.payload,
          completed: false
        }];
      case 'TOGGLE_TODO':
        return state.map(todo => 
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        );
      case 'REMOVE_TODO':
        return state.filter(todo => todo.id !== action.payload);
      default:
        return state;
    }
  };
  
  // Use reducer hook
  const [todos, dispatch] = React.useReducer(todoReducer, []);
  const [text, setText] = useState('');
  
  const handleAdd = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch({ type: 'ADD_TODO', payload: text });
      setText('');
    }
  };
  
  return (
    <div className="todo-app">
      <h3>Todo App</h3>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add todo item..."
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
            >
              {todo.text}
            </span>
            <button 
              onClick={() => dispatch({ type: 'REMOVE_TODO', payload: todo.id })}
              style={{ marginLeft: '10px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 10. Component with custom hook
function useLocalStorage(key, initialValue) {
  // Create state based on value in localStorage or initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });
  
  // Update localStorage when state changes
  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  
  return [storedValue, setValue];
}

// Using the custom hook
const PersistentCounter = () => {
  const [count, setCount] = useLocalStorage('counter', 0);
  
  return (
    <div className="persistent-counter">
      <h3>Persistent Counter: {count}</h3>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>This counter will remember its value when you refresh the page</p>
    </div>
  );
};

// Example App Component that uses all the components
const App = () => {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <div className={`app theme-${theme}`}>
        <h1>React Components Demo</h1>
        
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
        
        <section className="section">
          <h2>1. Function Component with Hooks</h2>
          <Counter />
        </section>
        
        <section className="section">
          <h2>2. Class Component</h2>
          <Timer message="Class components use lifecycle methods" />
        </section>
        
        <section className="section">
          <h2>3. Props</h2>
          <Greeting name="Alice" role="Developer" />
          <Greeting name="Bob" />
          <Greeting />
        </section>
        
        <section className="section">
          <h2>4. Context API</h2>
          <ThemedButton />
        </section>
        
        <section className="section">
          <h2>5. Higher-Order Component (HOC)</h2>
          <LoggedGreeting name="Charlie" role="Designer" />
        </section>
        
        <section className="section">
          <h2>6. Conditional Rendering</h2>
          <UserStatus isLoggedIn={true} username="dave_developer" />
          <UserStatus isLoggedIn={false} />
        </section>
        
        <section className="section">
          <h2>7. List Rendering</h2>
          <TodoList items={[
            { id: 1, text: 'Learn React', completed: true },
            { id: 2, text: 'Build an app', completed: false },
            { id: 3, text: 'Deploy to production', completed: false }
          ]} />
        </section>
        
        <section className="section">
          <h2>8. Form Handling</h2>
          <SimpleForm />
        </section>
        
        <section className="section">
          <h2>9. useReducer for Complex State</h2>
          <TodoApp />
        </section>
        
        <section className="section">
          <h2>10. Custom Hooks</h2>
          <PersistentCounter />
        </section>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;