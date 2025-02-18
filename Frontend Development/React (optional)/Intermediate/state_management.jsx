import React, { useState } from 'react';

const StateManagementExample = () => {
    // Declare a state variable called 'count' and a function to update it
    const [count, setCount] = useState(0);

    // Function to handle incrementing the count
    const increment = () => {
        setCount(count + 1);
    };

    // Function to handle decrementing the count
    const decrement = () => {
        setCount(count - 1);
    };

    return (
        <div>
            <h1>State Management Example</h1>
            <p>Current Count: {count}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    );
};

export default StateManagementExample;