
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InactivityHandler = () => {
    const navigate = useNavigate();
    let timeout;

const resetTimeout = () => {
if (timeout) clearTimeout(timeout);
timeout = setTimeout(() => {
sessionStorage.clear();
navigate('/login');
}, 900000); //15 minutes of inactivity
};

useEffect(() => {
window.addEventListener('mousemove', resetTimeout);
window.addEventListener('keydown', resetTimeout);

resetTimeout(); //Initialize timeout

return () => {
window.removeEventListener('mousemove', resetTimeout);
window.removeEventListener('keydown', resetTimeout);
if (timeout) clearTimeout(timeout);
};
}, []);

return null;
};

export default InactivityHandler;
