import React from 'react';
import PropTypes from 'prop-types';
import styles from '@/features/login_page/AuthLayout.module.css';

export default function RegisterForm({ values, errors, onInputChange }) {
    const handleChange = (event) => {
        const { name, value } = event.target;
        onInputChange({
            ...values,
            [name]: value
        });
    };

    return (
        <div className={styles.formBox}>
            <h2 className={styles.formTitle}>CREATE ACCOUNT:</h2>

            <div className={styles.formGroup}>
                <div className={`${styles.formLabels} ${styles.register}`}>
                    <label htmlFor="email">Email:</label>
                    <label htmlFor="username">Username:</label>
                    <label htmlFor="password">Password:</label>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                </div>

                <div className={styles.formInputs}>
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                            value={values.email}
                            onChange={handleChange}
                            aria-label="Email"
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className={`${styles.input} ${errors.username ? styles.errorInput : ''}`}
                            value={values.username}
                            onChange={handleChange}
                            aria-label="Username"
                        />
                        {errors.username && <span className={styles.errorText}>{errors.username}</span>}
                    </div>

                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
                            value={values.password}
                            onChange={handleChange}
                            aria-label="Password"
                        />
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>

                    <div>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ''}`}
                            value={values.confirmPassword}
                            onChange={handleChange}
                            aria-label="Confirm Password"
                        />
                        {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

RegisterForm.propTypes = {
    values: PropTypes.shape({
        email: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        confirmPassword: PropTypes.string.isRequired
    }).isRequired,
    errors: PropTypes.shape({
        email: PropTypes.string,
        username: PropTypes.string,
        password: PropTypes.string,
        confirmPassword: PropTypes.string
    }).isRequired,
    onInputChange: PropTypes.func.isRequired
};