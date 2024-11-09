import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [language, setLanguage] = useState('');
    const [proficiency, setProficiency] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const register = async () => {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                firstName,
                lastName,
                languagesToLearn: language,
                proficiencyLevel: proficiency,
            }),
        });

        const data = await response.json();
        if (response.status === 200) {
            setMessage(data.message);
            navigate('/');
        } else {
            setMessage(data.message);
        }
    };

    return (
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
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="" disabled>
                    Select a language to learn
                </option>
                <option value="Spanish">Spanish</option>
                <option value="Afrikaans">Afrikaans</option>
                <option value="French">French</option>
            </select>
            <select value={proficiency} onChange={(e) => setProficiency(e.target.value)}>
                <option value="" disabled>
                    Select proficiency level
                </option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>
            <button onClick={register}>Register</button>
            <p>{message}</p>
        </div>
    );
};

export default Register;
