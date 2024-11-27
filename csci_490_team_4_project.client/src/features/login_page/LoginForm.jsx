import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx'
import useFormValidation from '@/hooks/useFormValidation';
import styles from '@/features/login_page/AuthLayout.module.css';

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [submitError, setSubmitError] = useState('');

    const {
        values,
        errors,
        handleChange,
        validateForm
    } = useFormValidation({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateForm('login')) {
            return;
        }

        const result = await login(values.email, values.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setSubmitError('Invalid email or password');
        }
    };

    return (
        <form className={styles.formBox} onSubmit={handleSubmit}>
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

            {submitError && <div className={styles.submitError}>{submitError}</div>}

            <button type="submit" className={styles.submitButton}>
                Login
            </button>
        </form>
    );
}