import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useBudgetData = () => {
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchBudgetData = async () => {
        try {
            // Step 1: Get the budgetId from UserBudget using userId
            const userBudgetResponse = await fetch(`/api/userbudget/${user.userId}`);
            if (!userBudgetResponse.ok) throw new Error('Failed to fetch user budget');
            const userBudgetData = await userBudgetResponse.json();
            const budgetId = userBudgetData.budgetId;

            // Step 2: Get budget details using budgetId
            const budgetResponse = await fetch(`/api/budget/${budgetId}`);
            if (!budgetResponse.ok) throw new Error('Failed to fetch budget details');
            const budgetDetails = await budgetResponse.json();

            // Step 3: Get budget categories using budgetId
            const budgetCatResponse = await fetch(`/api/budgetcat/${budgetId}`);
            if (!budgetCatResponse.ok) throw new Error('Failed to fetch budget categories');
            const budgetCatData = await budgetCatResponse.json();

            // Convert to array if single object
            const budgetCategories = Array.isArray(budgetCatData) ? budgetCatData : [budgetCatData];

            // Step 4: Get category details for each catId
            const categoryDetailsPromises = budgetCategories.map(async (bc) => {
                const categoryResponse = await fetch(`/api/category/${bc.catId}`);
                if (!categoryResponse.ok) throw new Error('Failed to fetch category details');
                const categoryDetails = await categoryResponse.json();
                return {
                    ...categoryDetails,
                    budgetAmount: bc.budgetAmount
                };
            });

            const categoriesWithDetails = await Promise.all(categoryDetailsPromises);

            // Combine all the data
            const combinedData = {
                budgetId: budgetDetails.budgetId,
                year: budgetDetails.year,
                month: budgetDetails.month,
                monthlyIncome: budgetDetails.monthIncome,
                categories: categoriesWithDetails.map(category => ({
                    id: category.catId,
                    name: category.categoryName,
                    amount: category.budgetAmount
                })),
                totalBudget: categoriesWithDetails.reduce((sum, cat) => sum + cat.budgetAmount, 0)
            };

            setBudgetData(combinedData);
        } catch (err) {
            setError(err.message);
            console.error('Budget data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBudgetData();
        }
    }, [user]);

    return { budgetData, loading, error, refetch: fetchBudgetData };
};
