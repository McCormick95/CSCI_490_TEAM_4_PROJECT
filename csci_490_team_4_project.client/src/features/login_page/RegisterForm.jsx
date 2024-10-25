import React from 'react';
import styles from './AuthLayout.module.css';

export default function RegisterForm() {
    return (
        <form className={styles.formBox}>
            <h2 className={styles.formTitle}>CREATE ACCOUNT:</h2>

            <div className={styles.formGroup}>
                <div className={styles.formLabels}>
                    <label htmlFor="registerEmail">Email:</label>
                    <label htmlFor="registerUsername">Username:</label>
                    <label htmlFor="registerPassword">Password:</label>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                </div>

                <div className={styles.formInputs}>
                    <input
                        type="email"
                        id="registerEmail"
                        className={styles.input}
                        aria-label="Email"
                    />
                    <input
                        type="text"
                        id="registerUsername"
                        className={styles.input}
                        aria-label="Username"
                    />
                    <input
                        type="password"
                        id="registerPassword"
                        className={styles.input}
                        aria-label="Password"
                    />
                    <input
                        type="password"
                        id="confirmPassword"
                        className={styles.input}
                        aria-label="Confirm Password"
                    />
                </div>
            </div>
        </form>
    );
}