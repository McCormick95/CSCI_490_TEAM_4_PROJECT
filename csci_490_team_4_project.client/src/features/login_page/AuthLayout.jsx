import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import styles from '@/features/login_page/AuthLayout.module.css';

export default function AuthLayout() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loginValues, setLoginValues] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!loginValues.email || !validateEmail(loginValues.email)) {
            newErrors.email = 'Valid email is required';
        }
        if (!loginValues.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        setSubmitError('');
        if (!validateForm()) {
            return;
        }

        const result = await login(loginValues.email, loginValues.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setSubmitError('Invalid email or password');
        }
    };

    const handleInputChange = (values) => {
        setLoginValues(values);
    };

    return (
        <main className={styles.authPage}>
            <h1 className={styles.welcomeTitle}>Budget Tracker</h1>

            <div className={styles.authFormsContainer}>
                <LoginForm
                    values={loginValues}
                    errors={errors}
                    onInputChange={handleInputChange}
                />
                <RegisterForm />
            </div>

            <div className={styles.actionButtons}>
                <button
                    className={styles.actionButton}
                    onClick={handleLogin}
                >
                    Login
                </button>
                <button className={styles.actionButton}>Create Account</button>
            </div>
            {submitError && <div className={styles.submitError}>{submitError}</div>}
        </main>
    );
}