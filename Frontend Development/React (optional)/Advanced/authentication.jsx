import React, { useState } from 'react';

const Authentication = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate authentication process
        if (username === 'user' && password === 'password') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid credentials');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
    };

    return (
        <div>
            <h2>{isAuthenticated ? 'Welcome!' : 'Please Log In'}</h2>
            {!isAuthenticated ? (
                <form onSubmit={handleLogin}>
                    <div>
                        <label>
                            Username:
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Password:
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <button type="submit">Log In</button>
                </form>
            ) : (
                <div>
                    <p>You are logged in as {username}</p>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            )}
        </div>
    );
};

export default Authentication;