/**
 * React Hooks
 * ===========
 * This file demonstrates how to use React Hooks effectively.
 */

import React, { useState, useEffect, useRef, useContext, useReducer, useMemo, useCallback } from 'react';

// Context for demonstration
const UserContext = React.createContext(null);

// 1. useState - For managing state in functional components
const UseStateExample = () => {
  // Simple state
  const [count, setCount] = useState(0);
  
  // Object state
  const [user, setUser] = useState({
    name: 'John',
    email: 'john@example.com'
  });
  
  // Array state
  const [items, setItems] = useState(['Item 1', 'Item 2']);
  
  const updateUser = () => {
    // When updating object state, make sure to spread the previous state
    setUser(prevUser => ({
      ...prevUser,
      name: 'Jane',
      // email stays the same due to spreading prevUser
    }));
  };
  
  const addItem = () => {
    // When updating array state, create a new array
    setItems(prevItems => [...prevItems, `Item ${prevItems.length + 1}`]);
  };
  
  return (
    <div className="use-state-example">
      <h3>useState Example</h3>
      
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
      
      <div>
        <p>User: {user.name} ({user.email})</p>
        <button onClick={updateUser}>Update User</button>
      </div>
      
      <div>
        <p>Items: {items.join(', ')}</p>
        <button onClick={addItem}>Add Item</button>
      </div>
    </div>
  );
};

// 2. useEffect - For side effects in components
const UseEffectExample = () => {
  const [count, setCount] = useState(0);
  const [resourceType, setResourceType] = useState('posts');
  const [items, setItems] = useState([]);
  
  // Runs on every render
  useEffect(() => {
    console.log('render');
  });
  
  // Runs only on mount and unmount
  useEffect(() => {
    console.log('Component mounted');
    
    // Cleanup function runs on unmount
    return () => {
      console.log('Component will unmount');
    };
  }, []);
  
  // Runs when count changes
  useEffect(() => {
    console.log(`Count changed to: ${count}`);
    document.title = `Count: ${count}`;
  }, [count]);
  
  // Runs when resourceType changes
  useEffect(() => {
    console.log(`Resource type changed to: ${resourceType}`);
    
    // Simulating API call
    fetch(`https://jsonplaceholder.typicode.com/${resourceType}`)
      .then(response => response.json())
      .then(json => {
        setItems(json.slice(0, 3)); // Take only first 3 items
      });
  }, [resourceType]);
  
  return (
    <div className="use-effect-example">
      <h3>useEffect Example</h3>
      
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(prevCount => prevCount + 1)}>Increment</button>
      </div>
      
      <div>
        <button onClick={() => setResourceType('posts')}>Posts</button>
        <button onClick={() => setResourceType('users')}>Users</button>
        <button onClick={() => setResourceType('comments')}>Comments</button>
        <p>Resource Type: {resourceType}</p>
      </div>
      
      <div>
        <h4>Items:</h4>
        {items.map(item => (
          <pre key={item.id}>{JSON.stringify(item, null, 2)}</pre>
        ))}
      </div>
    </div>
  );
};

// 3. useContext - For consuming context in functional components
const UseContextExample = () => {
  // Context value
  const user = { name: 'Alice', role: 'Admin' };
  
  return (
    <UserContext.Provider value={user}>
      <div className="use-context-example">
        <h3>useContext Example</h3>
        <UserProfile />
      </div>
    </UserContext.Provider>
  );
};

// Component that consumes the context
const UserProfile = () => {
  const user = useContext(UserContext);
  
  return (
    <div className="user-profile">
      <p>Name: {user.name}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

// 4. useRef - For persistent values that don't trigger re-renders
const UseRefExample = () => {
  const [name, setName] = useState('');
  const inputRef = useRef(null);
  const renderCount = useRef(1);
  const prevName = useRef('');
  
  // Track renders - doesn't cause re-render when updated
  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  });
  
  // Track previous state value
  useEffect(() => {
    prevName.current = name;
  }, [name]);
  
  // Focus the input
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <div className="use-ref-example">
      <h3>useRef Example</h3>
      
      <div>
        <input 
          ref={inputRef} 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Enter your name"
        />
        <button onClick={focusInput}>Focus Input</button>
      </div>
      
      <p>Current name: {name}</p>
      <p>Previous name: {prevName.current}</p>
      <p>This component has rendered {renderCount.current} times</p>
    </div>
  );
};

// 5. useReducer - For complex state management
const UseReducerExample = () => {
  // Reducer function
  const reducer = (state, action) => {
    switch (action.type) {
      case 'increment':
        return { count: state.count + 1 };
      case 'decrement':
        return { count: state.count - 1 };
      case 'reset':
        return { count: 0 };
      default:
        return state;
    }
  };
  
  // Initialize with useReducer
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <div className="use-reducer-example">
      <h3>useReducer Example</h3>
      
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
};

// 6. useMemo - For memoizing expensive calculations
const UseMemoExample = () => {
  const [number, setNumber] = useState(1);
  const [dark, setDark] = useState(false);
  
  // Expensive calculation
  const doubleNumber = useMemo(() => {
    console.log('Calculating doubleNumber...');
    return slowFunction(number);
  }, [number]);
  
  // Memoized object to prevent unnecessary re-renders
  const themeStyles = useMemo(() => {
    console.log('Computing theme styles...');
    return {
      backgroundColor: dark ? '#333' : '#FFF',
      color: dark ? '#FFF' : '#333'
    };
  }, [dark]);
  
  // Log when theme styles object changes
  useEffect(() => {
    console.log('Theme styles changed');
  }, [themeStyles]);
  
  return (
    <div className="use-memo-example">
      <h3>useMemo Example</h3>
      
      <input
        type="number"
        value={number}
        onChange={e => setNumber(parseInt(e.target.value || 0))}
      />
      
      <button onClick={() => setDark(prevDark => !prevDark)}>
        Toggle Theme
      </button>
      
      <div style={themeStyles}>
        <p>Double: {doubleNumber}</p>
      </div>
    </div>
  );
};

// Slow function to demonstrate useMemo
function slowFunction(num) {
  console.log('Calling slow function...');
  // Simulate slow calculation
  for (let i = 0; i < 1000000000; i++) {}
  return num * 2;
}

// 7. useCallback - For memoizing functions
const UseCallbackExample = () => {
  const [number, setNumber] = useState(1);
  const [dark, setDark] = useState(false);
  
  // Without useCallback, this function would be recreated every render
  const getItems = useCallback(() => {
    console.log('getItems called');
    return [number, number + 1, number + 2];
  }, [number]);
  
  const theme = {
    backgroundColor: dark ? '#333' : '#FFF',
    color: dark ? '#FFF' : '#333'
  };
  
  return (
    <div className="use-callback-example" style={theme}>
      <h3>useCallback Example</h3>
      
      <input
        type="number"
        value={number}
        onChange={e => setNumber(parseInt(e.target.value || 0))}
      />
      
      <button onClick={() => setDark(prevDark => !prevDark)}>
        Toggle Theme
      </button>
      
      <ItemList getItems={getItems} />
    </div>
  );
};

// Child component that depends on the getItems function
const ItemList = React.memo(({ getItems }) => {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    console.log('ItemList - Updating items');
    setItems(getItems());
  }, [getItems]);
  
  return (
    <div>
      {items.map(item => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
});

// 8. Custom hooks - Reusable logic
const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.log(error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function
  const setValue = value => {
    try {
      // Allow value to be a function
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  
  return [storedValue, setValue];
};

// Another custom hook for window dimensions
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount
  
  return windowSize;
};

// Using custom hooks
const CustomHooksExample = () => {
  // Use our custom hooks
  const [name, setName] = useLocalStorage('name', 'Guest');
  const windowSize = useWindowSize();
  
  return (
    <div className="custom-hooks-example">
      <h3>Custom Hooks Example</h3>
      
      <div>
        <p>Persistent Name (stored in localStorage):</p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      
      <div>
        <p>Window Size:</p>
        <p>Width: {windowSize.width}px</p>
        <p>Height: {windowSize.height}px</p>
      </div>
    </div>
  );
};

// Main component that showcases all hook examples
const HooksDemo = () => {
  return (
    <div className="hooks-demo">
      <h1>React Hooks Examples</h1>
      
      <section>
        <UseStateExample />
      </section>
      
      <section>
        <UseEffectExample />
      </section>
      
      <section>
        <UseContextExample />
      </section>
      
      <section>
        <UseRefExample />
      </section>
      
      <section>
        <UseReducerExample />
      </section>
      
      <section>
        <UseMemoExample />
      </section>
      
      <section>
        <UseCallbackExample />
      </section>
      
      <section>
        <CustomHooksExample />
      </section>
    </div>
  );
};

// Export for use in other components
export default HooksDemo;