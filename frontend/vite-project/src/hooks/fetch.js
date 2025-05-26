import { useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiData, setApiData] = useState(null);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/check-auth');
                if (response.data.success) {
                    setApiData(response.data.user);
                    setServerError(null);
                } else {
                    setServerError({ message: 'Authentication failed' });
                    setApiData(null);
                }
            } catch (error) {
                let errorMessage = 'An error occurred while fetching data';
                
                if (error.response) {
                    errorMessage = error.response.data.message || error.response.data.error || errorMessage;
                } else if (error.request) {
                    errorMessage = 'No response from server. Please check your connection.';
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                setServerError({ message: errorMessage });
                setApiData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return [{ isLoading, apiData, serverError }];
}; 