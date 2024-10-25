import React from 'react';
import styles from './AuthLayout.module.css';

export default function LoginForm() {
    return (
        <form className={styles.formBox}>
            <h2 className={styles.formTitle}>LOG IN:</h2>

            <div className={styles.formGroup}>
                <div className={styles.formLabels}>
                    <label htmlFor="loginUsername">Username:</label>
                    <label htmlFor="loginPassword">Password:</label>
                </div>

                <div className={styles.formInputs}>
                    <input
                        type="text"
                        id="loginUsername"
                        className={styles.input}
                        aria-label="Username"
                    />
                    <input
                        type="password"
                        id="loginPassword"
                        className={styles.input}
                        aria-label="Password"
                    />
                </div>
            </div>
        </form>
    );
}