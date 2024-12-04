import React, { useState, useEffect } from 'react';
import budgetService from '../services/budgetService';
import expenseService from '../services/expenseService';

function Dashboard() {
    const [currentBudget, setCurrentBudget] = useState(null);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [monthlyStats, setMonthlyStats] = useState({
        totalSpent: 0,
        remaining: 0,
        percentageUsed: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            // Get all budgets first
            const budgets = await budgetService.getAllBudgets();
            const latestBudget = budgets && budgets.length > 0 ? budgets[0] : null;
            setCurrentBudget(latestBudget);

            // Get all expenses
            const expenses = await expenseService.getAll();
            const recentExpensesList = expenses && expenses.length > 0 ? expenses : [];
            setRecentExpenses(recentExpensesList);

            if (latestBudget && recentExpensesList.length > 0) {
                const totalSpent = recentExpensesList.reduce((sum, exp) => sum + exp.amount, 0);
                const remaining = latestBudget.monthIncome - totalSpent;
                const percentageUsed = (totalSpent / latestBudget.monthIncome) * 100;

                setMonthlyStats({
                    totalSpent,
                    remaining,
                    percentageUsed
                });
            }
        } catch (err) {
            console.error('Error loading dashboard:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (isLoading) return <div>Loading dashboard...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Financial Dashboard</h1>
            {currentBudget ? (
                <div>
                    <h2>Current Budget</h2>
                    <p>Monthly Income: {formatCurrency(currentBudget.monthIncome)}</p>
                    <p>Spent: {formatCurrency(monthlyStats.totalSpent)}</p>
                    <p>Remaining: {formatCurrency(monthlyStats.remaining)}</p>
                </div>
            ) : (
                <p>No budget data available. Add a budget to get started!</p>
            )}

            <div>
                <h2>Recent Expenses</h2>
                {recentExpenses.length > 0 ? (
                    <ul>
                        {recentExpenses.map((expense, index) => (
                            <li key={index}>
                                {expense.userDesc}: {formatCurrency(expense.amount)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recent expenses</p>
                )}
            </div>

            <div>
                <button onClick={loadDashboardData}>Refresh Dashboard</button>
            </div>
        </div>
    );
}

export default Dashboard;