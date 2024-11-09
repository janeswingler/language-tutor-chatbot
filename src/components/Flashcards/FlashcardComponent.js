import React, { useState } from 'react';
import './FlashcardComponent.css';

const FlashcardComponent = ({ card }) => {
    const [flipped, setFlipped] = useState(false);

    const handleClick = () => {
        setFlipped(!flipped);
    };

    return (
        <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleClick}>
            <div className="flashcard-inner">
                <div className="flashcard-front">
                    <p>{card.term}</p>
                </div>
                <div className="flashcard-back">
                    <p><strong>Translation:</strong> {card.translation}</p>
                    <p><strong>Definition:</strong> {card.definition}</p>
                    <p><strong>Example:</strong> {card.exampleUsage}</p>
                </div>
            </div>
        </div>
    );
};

export default FlashcardComponent;
