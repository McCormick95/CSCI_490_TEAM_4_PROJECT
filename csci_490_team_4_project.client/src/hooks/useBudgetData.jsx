import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useBudgetData = () => {
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchBudgetData = async () => {
        try {
            // First, fetch all user-budget relationships
            const userBudgetResponse = await fetch(`/api/userbudget/${user.userId}`);
            if (!userBudgetResponse.ok) throw new Error('Failed to fetch user budgets');
            const userBudgets = await userBudgetResponse.json();

            // Fetch detailed budget information for each budgetId
            const budgetPromises = userBudgets.map(async (userBudget) => {
                const budgetResponse = await fetch(`/api/budget/${userBudget.budgetId}`);
                if (!budgetResponse.ok) throw new Error(`Failed to fetch budget ${userBudget.budgetId}`);
                return budgetResponse.json();
            });

            const budgets = await Promise.all(budgetPromises);
            console.log('Raw budgets from API:', budgets);

            // For each budget, fetch its budget-category relationships
            const budgetCategoriesPromises = budgets.map(async (budget) => {
                const budgetCatResponse = await fetch(`/api/budgetcat/${budget.budgetId}`);
                if (!budgetCatResponse.ok) throw new Error(`Failed to fetch categories for budget ${budget.budgetId}`);
                const data = await budgetCatResponse.json();
                return Array.isArray(data) ? data : [data];
            });

            const budgetCategories = await Promise.all(budgetCategoriesPromises);

            // For each budget-category relationship, fetch the category details
            const categoriesWithDetails = await Promise.all(
                budgetCategories.map(async (categorySet) => {
                    const categoryDetailsPromises = categorySet.map(async (category) => {
                        const categoryResponse = await fetch(`/api/category/${category.catId}`);
                        if (!categoryResponse.ok) throw new Error(`Failed to fetch category ${category.catId}`);
                        const categoryData = await categoryResponse.json();

                        return {
                            categoryId: category.catId,
                            name: categoryData.catDesc,
                            amount: category.budgetAmount
                        };
                    });
                    return Promise.all(categoryDetailsPromises);
                })
            );

            // Combine all the data
            const combinedData = budgets.map((budget, index) => {
                // Calculate allocated amount from categories
                const allocatedAmount = categoriesWithDetails[index].reduce((sum, category) => {
                    return sum + (Number(category.amount) || 0);
                }, 0);

                return {
                    budgetId: budget.budgetId,
                    name: `Budget for ${budget.month}/${budget.year}`,
                    description: budget.description,
                    monthIncome: budget.monthIncome,
                    remainingAmount: budget.monthIncome - allocatedAmount,
                    allocatedAmount: allocatedAmount,
                    year: budget.year,
                    month: budget.month,
                    categories: categoriesWithDetails[index]
                };
            });

            // Sort budgets by year and month (most recent first)
            const sortedBudgets = combinedData.sort((a, b) => {
                if (a.year !== b.year) return b.year - a.year;
                return b.month - a.month;
            });

            setBudgetData({
                budgets: sortedBudgets,
                totalBudgets: sortedBudgets.length,
                // Use the most recent budget's monthIncome as the total
                totalAmount: sortedBudgets[0]?.monthIncome || 0
            });
        } catch (err) {
            console.error('Error fetching budget data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBudgetData();
        } else {
            setBudgetData(null);
            setLoading(false);
            setError(null);
        }
    }, [user]);

    return {
        budgetData,
        loading,
        error,
        refetch: fetchBudgetData
    };
};