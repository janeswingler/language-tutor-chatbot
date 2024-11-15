import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './Conversation.css';
import { useNavigate } from 'react-router-dom';

const Conversation = () => {
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [recommendedWords, setRecommendedWords] = useState('');
    const [feedbackSummary, setFeedbackSummary] = useState('');
    const [userDetails, setUserDetails] = useState({
        username: '',
        language: '',
        proficiencyLevel: '',
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isBlurred, setIsBlurred] = useState(false);
    const { transcript, resetTranscript } = useSpeechRecognition();

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (userId && token) {
            setIsLoggedIn(true);
            fetchUserDetails();
        }
    }, []);

    useEffect(() => {
        if (currentConversationId) {
            fetchChatHistory(currentConversationId);
        }
    }, [currentConversationId]);

    const toggleBlur = () => {
        setIsBlurred(!isBlurred);
    };

    const startNewConversation = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId) {
            setMessage('User ID is not available. Please log in again.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/chat/new?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setCurrentConversationId(data.conversationId);
                setConversations([]);
                setMessage('New conversation started');
            } else {
                setMessage('Failed to start a new conversation');
            }
        } catch (error) {
            console.error('Error starting new conversation:', error);
            setMessage('Error starting new conversation');
        }
    };

    const handleEndConversation = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!currentConversationId) {
            setMessage('No active conversation to end.');
            return;
        }

        try {
            const endResponse = await fetch(`http://localhost:8080/api/chat/end`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ conversationId: currentConversationId }),
            });

            const endData = await endResponse.json();
            if (endResponse.ok) {
                if (endData.recommendedWords) {
                    setRecommendedWords(endData.recommendedWords.join(', '));
                } else {
                    setRecommendedWords('No recommended words available.');
                }

                const feedbackResponse = await fetch(`http://localhost:8080/api/chat/conversation/${currentConversationId}/feedback`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const feedbackData = await feedbackResponse.text();
                console.log('Feedback Data:', feedbackData); // Log the feedback data
                if (feedbackResponse.ok) {
                    setFeedbackSummary(feedbackData);
                } else {
                    setFeedbackSummary('Failed to fetch feedback summary.');
                }
            } else {
                setMessage('Failed to end conversation');
            }
        } catch (error) {
            console.error('Error ending conversation:', error);
            setMessage('Error ending conversation');
        }
    };


    const fetchUserDetails = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId) {
            setMessage('User ID is not available. Please log in again.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setUserDetails({
                    username: data.username,
                    language: data.languagesToLearn,
                    proficiencyLevel: data.proficiencyLevel,
                });
            } else {
                setMessage('Failed to fetch user details');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            setMessage('Error fetching user details');
        }
    };

    const updateProficiencyLevel = async (newLevel) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId) {
            setMessage('User ID is not available. Please log in again.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/users/${userId}/proficiency`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ proficiencyLevel: newLevel }),  // Correct format
            });

            if (response.ok) {
                setUserDetails((prevDetails) => ({
                    ...prevDetails,
                    proficiencyLevel: newLevel,
                }));
                setMessage("Proficiency level updated successfully");
            } else {
                const data = await response.json();
                setMessage(data.message || "Failed to update proficiency level");
            }
        } catch (error) {
            console.error('Error updating proficiency level:', error);
            setMessage('Error updating proficiency level');
        }
    };

    const fetchChatHistory = async (conversationId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/api/chat/history/${conversationId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setConversations(data);
            } else {
                setMessage('Failed to fetch chat history');
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
            setMessage('Error fetching chat history');
        }
    };

    const languageMap = {
        Spanish: "es-ES",
        French: "fr-FR",
        Afrikaans: "af-ZA",
        English: "en-US",
    };

    const handleStartRecording = () => {
        const languageCode = languageMap[userDetails.language] || "en-US";
        setIsRecording(true);
        SpeechRecognition.startListening({ language: languageCode, continuous: true });
    };

    const handleStopRecording = async () => {
        setIsRecording(false);
        SpeechRecognition.stopListening();

        if (transcript.trim()) {
            const transcribedMessage = transcript.trim();
            setNewMessage(transcribedMessage);
            await handleSendMessage(transcribedMessage);
            resetTranscript();
        }
    };

    const synthesizeSpeech = async (text) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8080/api/text-to-speech/synthesize', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, languageCode: languageMap[userDetails.language] || "en-US" }),
            });

            const data = await response.json();
            if (response.ok && data.audioBase64) {
                const audioSrc = `data:audio/mp3;base64,${data.audioBase64}`;
                playAudio(audioSrc);
            } else {
                console.error('Failed to get audio');
            }
        } catch (error) {
            console.error('Error synthesizing speech:', error);
        }
    };

    const handleSendMessage = async (messageText = newMessage) => {
        messageText = String(messageText).trim();

        if (!currentConversationId || !messageText) {
            setMessage('Please start a new conversation or enter a message');
            return;
        }

        const token = localStorage.getItem('token');
        setLoading(true);

        const userMessage = {
            sender: 'user',
            text: messageText,
        };
        setConversations([...conversations, userMessage]);

        try {
            const response = await fetch('http://localhost:8080/api/chat/message', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversationId: currentConversationId,
                    messageText: messageText,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                const aiMessage = {
                    sender: 'Language Teacher',
                    text: data.text,
                    translation: data.translation,
                };
                setConversations([...conversations, userMessage, aiMessage]);
                setNewMessage('');
            } else {
                setMessage('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessage('Error sending message');
        } finally {
            setLoading(false);
        }
    };

    const playTextAsAudio = (text) => {
        synthesizeSpeech(text);
    };

    const playAudio = (audioSrc) => {
        const audio = new Audio(audioSrc);
        audio.play();
    };

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <p>Your browser does not support speech recognition.</p>;
    }

    return (
        <div>
            <h2>Conversations</h2>
            {isLoggedIn ? (
                <div>
                    <div>
                        <p><strong>Username:</strong> {userDetails.username}</p>
                        <p><strong>Language:</strong> {userDetails.language}</p>
                        <p><strong>Proficiency Level:</strong> {userDetails.proficiencyLevel}</p>

                        <select
                            value={userDetails.proficiencyLevel}
                            onChange={(e) => updateProficiencyLevel(e.target.value)}
                        >
                            <option value="" disabled>Select new proficiency level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    <button onClick={startNewConversation}>Start New Chat</button>
                </div>
            ) : (
                <p>Please log in to start a conversation</p>
            )}

            {currentConversationId && (
                <div>
                    <h3>Conversation ID: {currentConversationId}</h3>
                    <div className="chat-history">
                        {conversations.map((chat, index) => (
                            <div
                                key={index}
                                className={`chat-bubble ${chat.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}
                                title={chat.translation || 'Translation not available'}
                            >
                                <p><strong>{chat.sender}:</strong></p>
                                <p className={`chat-text ${isBlurred ? 'blurred-text' : ''}`}>{String(chat.text)}</p>
                                {chat.sender !== 'user' && (
                                    <button onClick={() => playTextAsAudio(chat.text)}>Play Audio</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={toggleBlur}>
                        {isBlurred ? 'Use Text & Audio Mode' : 'Use Audio-Only Mode'}
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(String(e.target.value))}
                        placeholder="Type your message"
                        disabled={loading}
                    />
                    <button onClick={() => handleSendMessage()} disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                    <button
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        disabled={loading}
                    >
                        {isRecording ? 'Stop Recording' : 'Start Voice Recording'}
                    </button>
                    <button onClick={handleEndConversation} disabled={loading}>
                        End Conversation
                    </button>

                    {/* Recommended Words Section */}
                    {recommendedWords && (
                        <div className="recommended-words">
                            <h4>Recommended Words</h4>
                            <p>{recommendedWords}</p>
                        </div>
                    )}

                    {/* Feedback Summary Section */}
                    {feedbackSummary && (
                        <div className="feedback-summary">
                            <h4>Feedback Summary</h4>
                            <p>{feedbackSummary}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

};

export default Conversation;


