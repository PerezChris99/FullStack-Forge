/**
 * React State Management
 * =====================
 * This file demonstrates different approaches to state management in React applications,
 * including Context API, Redux, and other alternatives.
 */

import React, { createContext, useContext, useReducer, useState } from 'react';

// ==========================================
// 1. Context API for Simple State Management
// ==========================================

// Create context with default value
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

// Provider component that will wrap the application
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  // The value provided to consumers
  const contextValue = {
    theme,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Consumer component that uses the theme
const ThemedButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const buttonStyle = {
    backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
    color: theme === 'dark' ? '#fff' : '#333',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };
  
  return (
    <button 
      style={buttonStyle} 
      onClick={toggleTheme}
    >
      Current theme: {theme}. Click to toggle!
    </button>
  );
};

// ==========================================
// 2. Context + Reducer (Redux-like pattern)
// ==========================================

// Action types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';

// Initial state
const initialTodosState = {
  todos: [
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: true }
  ]
};

// Reducer function
const todosReducer = (state, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false
          }
        ]
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    default:
      return state;
  }
};

// Create context for todos
const TodosContext = createContext();

// Provider component that will manage state using useReducer
const TodosProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todosReducer, initialTodosState);
  
  return (
    <TodosContext.Provider value={{ state, dispatch }}>
      {children}
    </TodosContext.Provider>
  );
};

// Components that use the todos state
const TodoList = () => {
  const { state, dispatch } = useContext(TodosContext);
  const [inputText, setInputText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      dispatch({ type: ADD_TODO, payload: inputText });
      setInputText('');
    }
  };
  
  return (
    <div className="todo-app">
      <h2>Todos with Context + Reducer</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Add new todo"
        />
        <button type="submit">Add</button>
      </form>
      
      <ul>
        {state.todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: TOGGLE_TODO, payload: todo.id })}
            />
            <span style={{ 
              textDecoration: todo.completed ? 'line-through' : 'none',
              marginLeft: '10px'
            }}>
              {todo.text}
            </span>
            <button 
              onClick={() => dispatch({ type: DELETE_TODO, payload: todo.id })}
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

// ==========================================
// 3. Redux Structure (simulation, not actual Redux)
// ==========================================

// Action creators
const reduxActionCreators = `
// actions.js
export const addTodo = (text) => ({
  type: 'ADD_TODO',
  payload: { id: Date.now(), text, completed: false }
});

export const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  payload: { id }
});

export const deleteTodo = (id) => ({
  type: 'DELETE_TODO',
  payload: { id }
});
`;

// Reducer
const reduxReducer = `
// reducer.js
const initialState = {
  todos: []
};

const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id)
      };
    default:
      return state;
  }
};

export default todosReducer;
`;

// Store configuration
const reduxStore = `
// store.js
import { createStore } from 'redux';
import todosReducer from './reducer';

const store = createStore(
  todosReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
`;

// Using Redux in a component
const reduxUsage = `
// TodoApp.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo } from './actions';

const TodoApp = () => {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(addTodo(text));
      setText('');
    }
  };

  return (
    <div>
      <h2>Todo App with Redux</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => dispatch(toggleTodo(todo.id))}
            >
              {todo.text}
            </span>
            <button onClick={() => dispatch(deleteTodo(todo.id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
`;

// ==========================================
// 4. Zustand (Simple State Management Alternative)
// ==========================================

const zustandExample = `
// Using Zustand - a minimalistic state management library
// First: npm install zustand

// todoStore.js
import create from 'zustand';

const useTodoStore = create(set => ({
  todos: [
    { id: 1, text: 'Learn Zustand', completed: false }
  ],
  addTodo: (text) => set(state => ({
    todos: [...state.todos, { id: Date.now(), text, completed: false }]
  })),
  toggleTodo: (id) => set(state => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  deleteTodo: (id) => set(state => ({
    todos: state.todos.filter(todo => todo.id !== id)
  }))
}));

// TodoApp.js using Zustand
import React, { useState } from 'react';
import useTodoStore from './todoStore';

const TodoApp = () => {
  const todos = useTodoStore(state => state.todos);
  const addTodo = useTodoStore(state => state.addTodo);
  const toggleTodo = useTodoStore(state => state.toggleTodo);
  const deleteTodo = useTodoStore(state => state.deleteTodo);
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };

  return (
    <div>
      <h2>Todo App with Zustand</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
`;

// ==========================================
// 5. Recoil (Facebook's State Management Library)
// ==========================================

const recoilExample = `
// Using Recoil - Facebook's experimental state management library
// First: npm install recoil

// atoms.js
import { atom, selector } from 'recoil';

export const todosAtom = atom({
  key: 'todosState',
  default: [
    { id: 1, text: 'Learn Recoil', completed: false }
  ]
});

export const todoStatsSelector = selector({
  key: 'todoStats',
  get: ({get}) => {
    const todos = get(todosAtom);
    const totalNum = todos.length;
    const totalCompletedNum = todos.filter(todo => todo.completed).length;
    const totalUncompletedNum = totalNum - totalCompletedNum;
    
    return {
      totalNum,
      totalCompletedNum,
      totalUncompletedNum
    };
  }
});

// TodoApp.js using Recoil
import React, { useState } from 'react';
import { 
  RecoilRoot,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import { todosAtom, todoStatsSelector } from './atoms';

const TodoApp = () => {
  return (
    <RecoilRoot>
      <TodoList />
      <TodoStats />
    </RecoilRoot>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useRecoilState(todosAtom);
  const [text, setText] = useState('');

  const addTodo = (text) => {
    setTodos([
      ...todos,
      { id: Date.now(), text, completed: false }
    ]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };

  return (
    <div>
      <h2>Todo App with Recoil</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TodoStats = () => {
  const stats = useRecoilValue(todoStatsSelector);
  
  return (
    <div>
      <h3>Stats</h3>
      <p>Total items: {stats.totalNum}</p>
      <p>Completed: {stats.totalCompletedNum}</p>
      <p>Uncompleted: {stats.totalUncompletedNum}</p>
    </div>
  );
};
`;

// ==========================================
// Demo component that brings everything together
// ==========================================

const StateManagementDemo = () => {
  return (
    <div className="state-management-demo">
      <h1>React State Management Approaches</h1>
      
      <section>
        <h2>1. Context API for Simple State</h2>
        <ThemeProvider>
          <div className="demo-section">
            <p>This button uses React Context to manage theme state:</p>
            <ThemedButton />
          </div>
        </ThemeProvider>
      </section>
      
      <section>
        <h2>2. Context + Reducer Pattern</h2>
        <TodosProvider>
          <TodoList />
        </TodosProvider>
      </section>
      
      <section>
        <h2>3. Redux Structure (Code Example)</h2>
        <div className="code-example">
          <h3>Action Creators:</h3>
          <pre>{reduxActionCreators}</pre>
          
          <h3>Reducer:</h3>
          <pre>{reduxReducer}</pre>
          
          <h3>Store Configuration:</h3>
          <pre>{reduxStore}</pre>
          
          <h3>Component Usage:</h3>
          <pre>{reduxUsage}</pre>
        </div>
      </section>
      
      <section>
        <h2>4. Zustand (Code Example)</h2>
        <div className="code-example">
          <pre>{zustandExample}</pre>
        </div>
      </section>
      
      <section>
        <h2>5. Recoil (Code Example)</h2>
        <div className="code-example">
          <pre>{recoilExample}</pre>
        </div>
      </section>
      
      <section>
        <h2>Choosing a State Management Solution</h2>
        <table>
          <thead>
            <tr>
              <th>Solution</th>
              <th>Pros</th>
              <th>Cons</th>
              <th>Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>useState</td>
              <td>Simple, built-in, no dependencies</td>
              <td>Limited to component, prop drilling for sharing</td>
              <td>Small components, local state</td>
            </tr>
            <tr>
              <td>Context API</td>
              <td>Built-in, avoids prop drilling</td>
              <td>Performance concerns with large state, no devtools</td>
              <td>Medium apps, theme/auth state</td>
            </tr>
            <tr>
              <td>Context + useReducer</td>
              <td>Organized state transitions, no dependencies</td>
              <td>Verbose, manual setup</td>
              <td>Medium apps, complex local state</td>
            </tr>
            <tr>
              <td>Redux</td>
              <td>Mature, powerful devtools, middleware</td>
              <td>Setup boilerplate, learning curve</td>
              <td>Large apps, complex data flows</td>
            </tr>
            <tr>
              <td>Zustand</td>
              <td>Simple API, minimal boilerplate, fast</td>
              <td>Less ecosystem than Redux</td>
              <td>Small to medium apps, fast setup</td>
            </tr>
            <tr>
              <td>Recoil</td>
              <td>Atomic model, derived state, concurrent mode</td>
              <td>Experimental, API may change</td>
              <td>React-focused apps, derived state</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default StateManagementDemo;