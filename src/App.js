import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import Navigation from './components/Navigation/Navigation';
import HomePage from './components/HomePage/HomePage';
import Conversation from './components/Conversation/Conversation';
import FlashcardsPage from './components/Flashcards/FlashcardsPage';
import Logout from './components/Login/Logout';
import QuizPage from "./components/Quiz/QuizPage";

function App() {
    return (
        <div className="App">
            <Navigation />
            <header className="App-header">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/conversations" element={<Conversation />} />
                    <Route path="/flashcards" element={<FlashcardsPage />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/quiz/:packId" element={<QuizPage />} />
                </Routes>
            </header>
        </div>
    );
}

export default App;
