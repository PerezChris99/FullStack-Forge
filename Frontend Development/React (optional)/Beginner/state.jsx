import React, { useState } from 'react';

const StateExample = () => {
    // Declare a state variable called 'count' and a function to update it
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>Current Count: {count}</h1>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
        </div>
    );
};

export default StateExample;