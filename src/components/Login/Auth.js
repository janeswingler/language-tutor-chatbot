import React, { useState } from 'react';

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [users, setUsers] = useState([]); // Add state to store users

    // Handles user registration
    const register = async () => {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();
        if (response.status === 200) {
            setMessage(data.message);
        } else {
            setMessage(data.message);
        }
    };

    // Handles user login
    const login = async () => {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();
        if (response.status === 200) {
            setMessage(data.message);
            setToken(data.token);
            localStorage.setItem('token', data.token); // Save the token in localStorage
        } else {
            setMessage(data.message);
        }
    };

    // Handles user logout (clear token)
    const logout = () => {
        setMessage('User logged out successfully');
        setToken('');
        localStorage.removeItem('token');
    };

    // Fetch all users and set the state
    const showAllUsers = async () => {
        const token = localStorage.getItem('token'); // Get the JWT token from localStorage
        const response = await fetch('http://localhost:8080/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (response.status === 200) {
            setUsers(data); // Store the users in the state
        } else {
            setMessage('Failed to fetch users');
        }
    };

    return (
        <div>
            <h1>User Authentication</h1>

            <div>
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={register}>Register</button>
            </div>

            <div>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={login}>Login</button>
            </div>

            {token && (
                <div>
                    <h2>Logout</h2>
                    <button onClick={logout}>Logout</button>
                    <button onClick={showAllUsers}>Show All Users</button> {/* Show users button */}
                </div>
            )}

            <p>{message}</p>

            {/* Display users in a table */}
            {users.length > 0 && (
                <div>
                    <h2>All Users</h2>
                    <table border="1">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Auth;
