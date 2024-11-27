import React from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import styles from '@/features/login_page/AuthLayout.module.css';

export default function AuthLayout() {
    return (
        <main className={styles.authPage}>
            <h1 className={styles.welcomeTitle}>Budget Tracker</h1>

            <div className={styles.authFormsContainer}>
                <LoginForm />
                <RegisterForm />
            </div>

            <div className={styles.actionButtons}>
                <button className={styles.actionButton}>Login</button>
                <button className={styles.actionButton}>Create Account</button>
            </div>
        </main>
    );
}