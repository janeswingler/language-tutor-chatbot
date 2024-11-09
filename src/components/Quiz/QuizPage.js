import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const QuizPage = () => {
    const { packId } = useParams();
    const navigate = useNavigate();
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [message, setMessage] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [hint, setHint] = useState('');

    useEffect(() => {
        fetchFlashcards();
    }, []);

    const fetchFlashcards = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setMessage('Please log in to take the quiz.');
            return;
        }

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
            } else {
                setMessage('Failed to fetch flashcards');
            }
        } catch (error) {
            console.error('Error fetching flashcards:', error);
            setMessage('Error fetching flashcards');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const correctTranslation = flashcards[currentIndex].translation.toLowerCase().trim();
        const userTranslation = userAnswer.toLowerCase().trim();

        if (userTranslation === correctTranslation) {
            // Correct answer
            setMessage('Correct!');
            setAttempts(0);
            setHint('');
            setUserAnswer('');
            setTimeout(() => setMessage(''), 1000);
            if (currentIndex + 1 < flashcards.length) {
                setCurrentIndex(currentIndex + 1);
            } else {
                // Quiz completed
                markQuizAsCompleted();
            }
        } else {
            // Incorrect answer
            if (attempts === 0) {
                setHint(`Hint: Definition - ${flashcards[currentIndex].definition}`);
                setAttempts(attempts + 1);
            } else if (attempts === 1) {
                const exampleUsage = flashcards[currentIndex].exampleUsage;
                const exampleWithoutTranslation = exampleUsage.replace(/\s*\(.*?\)\s*/g, '').trim();
                setHint(`Hint: Example Usage - ${exampleWithoutTranslation}`);
                setAttempts(attempts + 1);
            } else {
                setMessage(`The correct translation is: ${flashcards[currentIndex].translation}`);
                setAttempts(0);
                setHint('');
                setUserAnswer('');
                if (currentIndex + 1 < flashcards.length) {
                    setCurrentIndex(currentIndex + 1);
                } else {
                    // Quiz completed
                    markQuizAsCompleted();
                }
            }
        }
    };

    const markQuizAsCompleted = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8080/api/flashcard-packs/${packId}/complete`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                navigate('/flashcards', { state: { refresh: true } });
            } else {
                setMessage('Failed to update quiz completion status');
            }
        } catch (error) {
            console.error('Error updating quiz completion status:', error);
            setMessage('Error updating quiz completion status');
        }
    };

    if (flashcards.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <div className="quiz-page">
            <h2>Quiz: Flashcard Pack {packId}</h2>
            {message && <p>{message}</p>}
            <p><strong>Term:</strong> {flashcards[currentIndex].term}</p>
            {hint && <p>{hint}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter the translation"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default QuizPage;
