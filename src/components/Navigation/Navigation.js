import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ token }) => {
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {!token ? (
                    <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/conversations">Conversations</Link>
                        </li>
                        <li>
                            <Link to="/flashcards">Flashcards</Link>
                        </li>
                        <li>
                            <Link to="/logout">Logout</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navigation;
