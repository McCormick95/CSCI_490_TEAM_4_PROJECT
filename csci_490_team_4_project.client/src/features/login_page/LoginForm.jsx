import React from 'react';
import styles from '@/features/login_page/AuthLayout.module.css';
import PropTypes from 'prop-types';

export default function LoginForm({ values, errors, onInputChange }) {
    const handleChange = (event) => {
        const { name, value } = event.target;
        onInputChange({
            ...values,
            [name]: value
        });
    };

    return (
        <div className={styles.formBox}>
            <h2 className={styles.formTitle}>LOG IN</h2>

            <div className={styles.formGroup}>
                <div className={styles.formLabels}>
                    <label htmlFor="email">Email:</label>
                    <label htmlFor="password">Password:</label>
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
                </div>
            </div>
        </div>
    );
}

LoginForm.propTypes = {
    values: PropTypes.shape({
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired
    }).isRequired,
    errors: PropTypes.shape({
        email: PropTypes.string,
        password: PropTypes.string
    }).isRequired,
    onInputChange: PropTypes.func.isRequired
};