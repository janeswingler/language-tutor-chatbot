import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import Navigation from './components/Navigation/Navigation';
import HomePage from './components/HomePage/HomePage';
import Conversation from './components/Conversation/Conversation';
import FlashcardsPage from './components/Flashcards/FlashcardsPage';
import Logout from './components/Login/Logout';
import QuizPage from './components/Quiz/QuizPage';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

    const handleLogin = (token) => {
        setToken(token);
        setUserId(userId);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setToken('');
        setUserId('');
    };

    return (
        <div className="App">
            <Navigation token={token} />
            <header className="App-header">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/conversations" element={<Conversation />} />
                    <Route path="/flashcards" element={<FlashcardsPage token={token} userId={userId} />} />
                    <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
                    <Route path="/quiz/:packId" element={<QuizPage />} />
                </Routes>
            </header>
        </div>
    );
}

export default App;
