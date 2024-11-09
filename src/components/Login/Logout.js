// src/components/Login/Logout.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    }, [navigate]);

    return null;
};

export default Logout;
