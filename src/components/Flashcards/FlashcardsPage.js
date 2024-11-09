import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FlashcardComponent from './FlashcardComponent';
import './FlashcardsPage.css';

const FlashcardsPage = ({ token, userId }) => {
    const [flashcardPacks, setFlashcardPacks] = useState([]);
    const [selectedPackId, setSelectedPackId] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [totalFlashcards, setTotalFlashcards] = useState(0);
    const [studiedFlashcards, setStudiedFlashcards] = useState(0);

    const location = useLocation();

    useEffect(() => {
        fetchFlashcardPacks();
    }, [location]);

    useEffect(() => {
        if (flashcardPacks.length > 0) {
            let total = 0;
            let studied = 0;
            flashcardPacks.forEach(pack => {
                const numCards = pack.flashcards.length;
                total += numCards;
                if (pack.completed) {
                    studied += numCards;
                }
            });
            setTotalFlashcards(total);
            setStudiedFlashcards(studied);
        } else {
            setTotalFlashcards(0);
            setStudiedFlashcards(0);
        }
    }, [flashcardPacks]);

    const fetchFlashcardPacks = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId || !token) {
            setMessage('Please log in to view your flashcards.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/flashcard-packs/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setFlashcardPacks(data);
            } else {
                setMessage('Failed to fetch flashcard packs');
            }
        } catch (error) {
            console.error('Error fetching flashcard packs:', error);
            setMessage('Error fetching flashcard packs');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFlashcards = async (packId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            setMessage('Please log in to view your flashcards.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/flashcards/pack/${packId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setFlashcards(data);
                setSelectedPackId(packId);
            } else {
                setMessage('Failed to fetch flashcards');
            }
        } catch (error) {
            console.error('Error fetching flashcards:', error);
            setMessage('Error fetching flashcards');
        } finally {
            setIsLoading(false);
        }
    };

    const percentage = totalFlashcards > 0 ? (studiedFlashcards / totalFlashcards) * 100 : 0;

    let progressBarColor;
    if (percentage === 100) {
        progressBarColor = 'green';
    } else if (percentage >= 33) {
        progressBarColor = 'orange';
    } else {
        progressBarColor = 'red';
    }

    return (
        <div className="flashcards-page">
            <h2>Progress Dashboard</h2>
            <div className="dashboard-header">
                Track your study sessions and vocabulary progress
            </div>

            <div className="progress-section">
                <p><strong>Number of Chats:</strong> {flashcardPacks.length}</p>

                <div className="progress-bar-container">
                    <p>Your Progress: {studiedFlashcards}/{totalFlashcards} flashcards studied
                        ({totalFlashcards > 0 ? Math.round((studiedFlashcards / totalFlashcards) * 100) : 0}%)</p>
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${percentage}%`,
                                backgroundColor: progressBarColor,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
            {message && <p>{message}</p>}
            {isLoading && <p>Loading...</p>}
            <div className="packs-container">
                {flashcardPacks.length > 0 ? (
                    flashcardPacks.map((pack) => (
                        <div key={pack.id} className={`pack-item ${pack.completed ? 'completed' : 'incomplete'}`}>
                            <h3>{new Date(pack.createdAt).toLocaleDateString()}</h3>
                            <ul>
                                {pack.flashcards.slice(0, 5).map((card) => (
                                    <li key={card.id}>{card.term}</li>
                                ))}
                            </ul>
                            <button onClick={() => {
                                if (selectedPackId === pack.id) {
                                    setSelectedPackId(null);
                                    setFlashcards([]);
                                } else {
                                    fetchFlashcards(pack.id);
                                }
                            }}>
                                {selectedPackId === pack.id ? 'Hide Flashcards' : 'View Flashcards'}
                            </button>
                            {/* "Take the Quiz" button displayed for each pack */}
                            <Link to={`/quiz/${pack.id}`} className="quiz-button">
                                Take the Quiz
                            </Link>
                            {selectedPackId === pack.id && (
                                <div className="flashcards-container">
                                    {flashcards.length > 0 ? (
                                        flashcards.map((card) => (
                                            <FlashcardComponent key={card.id} card={card}/>
                                        ))
                                    ) : (
                                        <p>No flashcards found in this pack.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>You have no flashcard packs yet.</p>
                )}
            </div>
        </div>
    );
};

export default FlashcardsPage;


