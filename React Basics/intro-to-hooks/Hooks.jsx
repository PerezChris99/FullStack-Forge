import React, { useState, useEffect, useRef, useReducer, useCallback, useMemo, useContext, createContext } from 'react';

// Create a context for theme
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

// Custom hook for managing form input
function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  
  const reset = () => {
    setValue(initialValue);
  };
  
  return {
    value,
    onChange: handleChange,
    reset,
    bind: {
      value,
      onChange: handleChange
    }
  };
}

// Custom hook for fetching data
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url, { signal: abortController.signal });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    
    // Cleanup function for aborting the fetch if the component unmounts
    return () => {
      abortController.abort();
    };
  }, [url]);
  
  return { data, loading, error };
}

// Counter reducer function for useReducer example
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// useState Example
function StateExample() {
  const [count, setCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  
  return (
    <div className="example-section">
      <h3>useState Example</h3>
      <p>Count: {count}</p>
      <div>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
      </div>
      <div className="status-toggle">
        <span>Status: {isOnline ? 'Online' : 'Offline'}</span>
        <button onClick={() => setIsOnline(!isOnline)}>
          Toggle Status
        </button>
      </div>
      <pre>{`
const [count, setCount] = useState(0);
const [isOnline, setIsOnline] = useState(true);

// Update state
setCount(count + 1);
setIsOnline(!isOnline);
      `}</pre>
    </div>
  );
}

// useEffect Example
function EffectExample() {
  const [count, setCount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Effect that runs on every render
  useEffect(() => {
    document.title = `Count: ${count}`;
  });
  
  // Effect with cleanup (runs only when a dependency changes)
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array means this runs once on mount
  
  return (
    <div className="example-section">
      <h3>useEffect Example</h3>
      <p>Count: {count} (check the document title)</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Window width: {windowWidth}px (resize the window)</p>
      <pre>{`
// Effect that runs on every render
useEffect(() => {
  document.title = \`Count: \${count}\`;
});

// Effect with cleanup (runs once on mount)
useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []); // Empty dependency array
      `}</pre>
    </div>
  );
}

// useRef Example
function RefExample() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);
  const inputRef = useRef(null);
  
  const handleStart = () => {
    setStartTime(Date.now());
    setNow(Date.now());
    
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  };
  
  const handleStop = () => {
    clearInterval(intervalRef.current);
  };
  
  const handleReset = () => {
    setStartTime(null);
    setNow(null);
  };
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  const elapsedTime = startTime && now ? ((now - startTime) / 1000).toFixed(2) : 0;
  
  // Clean up the interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);
  
  return (
    <div className="example-section">
      <h3>useRef Example</h3>
      
      <div className="stopwatch">
        <p>Stopwatch: {elapsedTime} seconds</p>
        <button onClick={handleStart}>Start</button>
        <button onClick={handleStop}>Stop</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      
      <div className="input-focus">
        <input 
          ref={inputRef} 
          type="text" 
          placeholder="Focus will be set here"
        />
        <button onClick={focusInput}>Focus Input</button>
      </div>
      
      <pre>{`
const intervalRef = useRef(null);
const inputRef = useRef(null);

// Store interval ID
intervalRef.current = setInterval(() => {
  setNow(Date.now());
}, 10);

// Access DOM element
inputRef.current.focus();
      `}</pre>
    </div>
  );
}

// useReducer Example
function ReducerExample() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <div className="example-section">
      <h3>useReducer Example</h3>
      <p>Count: {state.count}</p>
      <div>
        <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
        <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      </div>
      <pre>{`
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error(\`Unhandled action type: \${action.type}\`);
  }
}

const [state, dispatch] = useReducer(counterReducer, { count: 0 });

// Dispatch actions
dispatch({ type: 'increment' });
      `}</pre>
    </div>
  );
}

// useMemo and useCallback Example
function MemoCallbackExample() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // Without useMemo, this calculation would run on every render
  const expensiveCalculation = useMemo(() => {
    console.log('Performing expensive calculation...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += i;
    }
    return result + count;
  }, [count]); // Only recalculate when count changes
  
  // Without useCallback, this function would be recreated on every render
  const handleButtonClick = useCallback(() => {
    console.log('Button clicked with count:', count);
    setCount(count + 1);
  }, [count]);
  
  return (
    <div className="example-section">
      <h3>useMemo and useCallback Example</h3>
      
      <div>
        <p>Count: {count}</p>
        <p>Expensive calculation result: {expensiveCalculation}</p>
        <button onClick={handleButtonClick}>Increment</button>
      </div>
      
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here (doesn't trigger calculation)"
        />
        <p>Text: {text}</p>
      </div>
      
      <pre>{`
// useMemo for expensive calculations
const expensiveCalculation = useMemo(() => {
  // This only runs when count changes
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += i;
  }
  return result + count;
}, [count]);

// useCallback for event handlers
const handleButtonClick = useCallback(() => {
  setCount(count + 1);
}, [count]);
      `}</pre>
    </div>
  );
}

// useContext Example
function ThemeToggler() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} theme
    </button>
  );
}

function ThemedBox() {
  const { theme } = useContext(ThemeContext);
  
  const style = {
    backgroundColor: theme === 'light' ? '#f8f9fa' : '#343a40',
    color: theme === 'light' ? '#212529' : '#f8f9fa',
    padding: '15px',
    borderRadius: '5px',
    transition: 'all 0.3s ease'
  };
  
  return (
    <div style={style}>
      <p>Current theme: {theme}</p>
      <ThemeToggler />
    </div>
  );
}

function ContextExample() {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  const themeContextValue = {
    theme,
    toggleTheme
  };
  
  return (
    <div className="example-section">
      <h3>useContext Example</h3>
      <ThemeContext.Provider value={themeContextValue}>
        <ThemedBox />
        <pre>{`
// Create context
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

// Use the context
function ThemeToggler() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} theme
    </button>
  );
}

// Provide the context
<ThemeContext.Provider value={{ theme, toggleTheme }}>
  <ThemedBox />
</ThemeContext.Provider>
        `}</pre>
      </ThemeContext.Provider>
    </div>
  );
}

// Custom Hooks Example
function CustomHooksExample() {
  const { value: name, bind: bindName, reset: resetName } = useInput('');
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users/1');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Hello, ${name}!`);
    resetName();
  };
  
  return (
    <div className="example-section">
      <h3>Custom Hooks Example</h3>
      
      <div className="custom-hook-demo">
        <h4>useInput Hook</h4>
        <form onSubmit={handleSubmit}>
          <input type="text" {...bindName} placeholder="Enter your name" />
          <button type="submit">Submit</button>
        </form>
      </div>
      
      <div className="custom-hook-demo">
        <h4>useFetch Hook</h4>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {data && (
          <div>
            <p>User data:</p>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <pre>{`
// Custom hook for form inputs
function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  
  return {
    value,
    setValue,
    reset: () => setValue(initialValue),
    bind: {
      value,
      onChange: e => setValue(e.target.value)
    }
  };
}

// Usage
const { value, bind, reset } = useInput('');
<input type="text" {...bind} />
      `}</pre>
    </div>
  );
}

// Main component that brings all examples together
function HooksDemo() {
  return (
    <div className="hooks-container">
      <header>
        <h1>React Hooks Examples</h1>
        <p>A comprehensive guide to React's built-in hooks and custom hooks</p>
      </header>
      
      <main>
        <StateExample />
        <EffectExample />
        <RefExample />
        <ReducerExample />
        <MemoCallbackExample />
        <ContextExample />
        <CustomHooksExample />
      </main>
      
      <footer>
        <p>Created for FullStack Forge - React Hooks</p>
        <p>
          <small>Based on React {React.version}</small>
        </p>
      </footer>
    </div>
  );
}

export default HooksDemo;