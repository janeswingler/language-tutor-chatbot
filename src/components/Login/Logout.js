import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId'); // Remove userId
        onLogout(); // Update token state in App.js
        navigate('/login');
    }, [onLogout, navigate]);

    return null;
};

export default Logout;
