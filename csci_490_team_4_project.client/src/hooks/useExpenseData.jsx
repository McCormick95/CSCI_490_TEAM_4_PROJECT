import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useExpenseData = () => {
    const [expenseData, setExpenseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchExpenseData = async () => {
        try {
            // Step 1: Get the expenseId(s) from UserExpense using userId
            const userExpenseResponse = await fetch(`/api/userexpense/${user.userId}`);
            if (!userExpenseResponse.ok) throw new Error('Failed to fetch user expenses');
            const userExpenseData = await userExpenseResponse.json();

            // Handle both single expense and multiple expenses
            const userExpenses = Array.isArray(userExpenseData) ? userExpenseData : [userExpenseData];

            // Step 2: Get expense details for each expenseId
            const expenseDetailsPromises = userExpenses.map(async (userExp) => {
                const expenseResponse = await fetch(`/api/expense/${userExp.expenseId}`);
                if (!expenseResponse.ok) throw new Error('Failed to fetch expense details');
                return expenseResponse.json();
            });

            const expenses = await Promise.all(expenseDetailsPromises);

            // Process expenses for chart display
            const processedData = expenses.reduce((acc, expense) => {
                // Construct date from year, month, and day
                const date = new Date(expense.year, expense.month - 1, expense.day); // month is 0-indexed in JS Date
                const month = date.toLocaleString('default', { month: 'short' });

                if (!acc[month]) {
                    acc[month] = { month, expenses: 0 };
                }
                acc[month].expenses += expense.amount;
                return acc;
            }, {});

            const spendingTrends = Object.values(processedData);

            setExpenseData({
                spendingTrends,
                totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
                expenses: expenses.map(exp => {
                    const date = new Date(exp.year, exp.month - 1, exp.day);
                    return {
                        id: exp.expenseId,
                        amount: exp.amount,
                        description: exp.userDesc,
                        date: date.toLocaleDateString(),
                        categoryId: exp.catId
                    };
                })
            });

        } catch (err) {
            setError(err.message);
            console.error('Expense data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchExpenseData();
        }
    }, [user]);

    return { expenseData, loading, error, refetch: fetchExpenseData };
};