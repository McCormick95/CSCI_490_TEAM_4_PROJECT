import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/features/login_page/AuthLayout';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import BudgetList from './components/BudgetList';
import ExpenseList from './components/ExpenseList';
import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <div className="App">
                        <Navigation />
                        <Dashboard />
                    </div>
                </ProtectedRoute>
            } />
            <Route path="/budgets" element={
                <ProtectedRoute>
                    <div className="App">
                        <Navigation />
                        <BudgetList />
                    </div>
                </ProtectedRoute>
            } />
            <Route path="/expenses" element={
                <ProtectedRoute>
                    <div className="App">
                        <Navigation />
                        <ExpenseList />
                    </div>
                </ProtectedRoute>
            } />
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* Catch all other routes and redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;