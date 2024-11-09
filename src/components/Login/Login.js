import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const navigate = useNavigate();

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
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            navigate('/flashcards'); // Redirect to home page upon successful login
        } else {
            setMessage(data.message);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setMessage('Logged out successfully.');
    };

    return (
        <div>
            {token ? (
                <>
                    <h2>You are logged in</h2>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
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
                </>
            )}
            <p>{message}</p>
        </div>
    );
};

export default Login;
