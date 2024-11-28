import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import styles from '@/features/login_page/AuthLayout.module.css';

export default function AuthLayout() {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [loginValues, setLoginValues] = useState({ email: '', password: '' });
    const [registerValues, setRegisterValues] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password);
    };

    const validateForm = (type) => {
        const newErrors = {};
        const values = type === 'login' ? loginValues : registerValues;

        if (!values.email || !validateEmail(values.email)) {
            newErrors.email = 'Valid email is required';
        }

        if (type === 'register') {
            if (!values.username || values.username.length < 3) {
                newErrors.username = 'Username must be at least 3 characters';
            }

            if (!validatePassword(values.password)) {
                newErrors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
            }

            if (values.password !== values.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        } else if (!values.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        setSubmitError('');
        if (!validateForm('login')) {
            return;
        }

        const result = await login(loginValues.email, loginValues.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setSubmitError('Invalid email or password');
        }
    };

    const handleRegister = async () => {
        setSubmitError('');
        if (!validateForm('register')) {
            return;
        }

        // Match the casing of your C# UserInfo model properties
        const userData = {
            userEmail: registerValues.email,
            userName: registerValues.username,
            password: registerValues.password
        };

        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Registration failed:', errorData);
                setSubmitError(`Registration failed: ${errorData}`);
                return;
            }

            const result = await response.json();

            // Automatically log in after successful registration
            const loginResult = await login(registerValues.email, registerValues.password);
            if (loginResult.success) {
                navigate('/dashboard');
            } else {
                setSubmitError('Registration successful but login failed. Please try logging in manually.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setSubmitError('An error occurred during registration. Please try again.');
        }
    };

    return (
        <main className={styles.authPage}>
            <h1 className={styles.welcomeTitle}>Budget Tracker</h1>

            <div className={styles.authFormsContainer}>
                <LoginForm
                    values={loginValues}
                    errors={errors}
                    onInputChange={setLoginValues}
                />
                <RegisterForm
                    values={registerValues}
                    errors={errors}
                    onInputChange={setRegisterValues}
                />
            </div>

            <div className={styles.actionButtons}>
                <button
                    className={styles.actionButton}
                    onClick={handleLogin}
                >
                    Login
                </button>
                <button
                    className={styles.actionButton}
                    onClick={handleRegister}
                >
                    Create Account
                </button>
            </div>
            {submitError && <div className={styles.submitError}>{submitError}</div>}
        </main>
    );
}