import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useExpenseData = () => {
    const [expenseData, setExpenseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchExpenseData = async () => {
        try {
            // Step 1: Get user expenses
            const userExpenseResponse = await fetch(`/api/userexpense/${user.userId}`);
            if (!userExpenseResponse.ok) throw new Error('Failed to fetch user expenses');
            const userExpenseData = await userExpenseResponse.json();
            console.log('User Expense Data:', userExpenseData);

            const userExpenses = Array.isArray(userExpenseData) ? userExpenseData : [userExpenseData];

            // Step 2: Get expense and category details
            const expenseDetailsPromises = userExpenses.map(async (userExp) => {
                // Fetch expense details
                const expenseResponse = await fetch(`/api/expense/${userExp.expenseId}`);
                if (!expenseResponse.ok) throw new Error('Failed to fetch expense details');
                const expenseDetails = await expenseResponse.json();
                console.log('Expense Details:', expenseDetails);

                // Fetch category details
                const categoryResponse = await fetch(`/api/category/${expenseDetails.catId}`);
                if (!categoryResponse.ok) throw new Error('Failed to fetch category details');
                const categoryDetails = await categoryResponse.json();
                console.log('Category Details:', categoryDetails);

                return {
                    ...expenseDetails,
                    categoryName: categoryDetails.catDesc
                };
            });

            const expenses = await Promise.all(expenseDetailsPromises);
            console.log('All Expenses:', expenses);

            // Group by category
            const categoryGroups = {};
            expenses.forEach(expense => {
                const categoryName = expense.categoryName;
                if (!categoryGroups[categoryName]) {
                    categoryGroups[categoryName] = 0;
                }
                categoryGroups[categoryName] += Number(expense.amount);
            });

            console.log('Category Groups:', categoryGroups);

            // Convert to array format for chart
            const categoryTrends = Object.entries(categoryGroups).map(([category, total]) => ({
                category,
                total: Number(total)
            }));

            console.log('Category Trends:', categoryTrends);

            // Sort by amount
            categoryTrends.sort((a, b) => b.total - a.total);

            const formattedData = {
                categoryTrends,
                totalExpenses: expenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
                expenses: expenses.map(exp => ({
                    id: exp.expenseId,
                    amount: Number(exp.amount),
                    description: exp.userDesc,
                    category: exp.categoryName,
                    date: new Date(exp.year, exp.month - 1, exp.day).toLocaleDateString()
                }))
            };

            console.log('Final Formatted Data:', formattedData);
            setExpenseData(formattedData);

        } catch (err) {
            console.error('Error in fetchExpenseData:', err);
            setError(err.message);
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