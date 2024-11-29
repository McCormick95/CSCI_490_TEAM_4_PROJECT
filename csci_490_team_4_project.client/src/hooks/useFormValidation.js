import { useState } from 'react';

const useFormValidation = (initialState) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password);
    };

    const validateForm = (type) => {
        const newErrors = {};

        if (!values.email || !validateEmail(values.email)) {
            newErrors.email = 'Valid email is required';
        }

        if (!values.password) {
            newErrors.password = 'Password is required';
        } else if (type === 'register' && !validatePassword(values.password)) {
            newErrors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
        }

        if (type === 'register') {
            if (!values.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (values.password !== values.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }

            if (!values.username || values.username.length < 3) {
                newErrors.username = 'Username must be at least 3 characters';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return {
        values,
        errors,
        handleChange,
        validateForm,
        setValues,
        setErrors
    };
};

export default useFormValidation;