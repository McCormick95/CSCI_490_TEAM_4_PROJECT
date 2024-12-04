import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

const initialFormData = {
    monthIncome: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    categories: []
};

export const BudgetPage = ({ onBack }) => {
    const { user } = useAuth();
    const [budgets, setBudgets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [remainingAmount, setRemainingAmount] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/category');
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                setAvailableCategories(Array.isArray(data) ? data : [data]);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const totalAllocated = formData.categories.reduce((sum, cat) => sum + (Number(cat.amount) || 0), 0);
        const remaining = Number(formData.monthIncome) - totalAllocated;
        setRemainingAmount(remaining);
    }, [formData.monthIncome, formData.categories]);

    const loadBudgets = async () => {
        try {
            setIsLoading(true);
            const userBudgetResponse = await fetch(`/api/userbudget/${user.userId}`);
            if (!userBudgetResponse.ok) throw new Error('Failed to fetch user budgets');
            const userBudgets = await userBudgetResponse.json();

            const budgetPromises = userBudgets.map(async (userBudget) => {
                const budgetResponse = await fetch(`/api/budget/${userBudget.budgetId}`);
                const budget = await budgetResponse.json();

                // Fetch categories for this budget
                const budgetCatResponse = await fetch(`/api/budgetcat/${userBudget.budgetId}`);
                const budgetCategories = await budgetCatResponse.json();

                return {
                    ...budget,
                    categories: budgetCategories
                };
            });

            const budgetData = await Promise.all(budgetPromises);
            setBudgets(budgetData);
        } catch (err) {
            console.error('Load error:', err);
            setError('Error loading budgets');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBudgets();
    }, [user.userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addCategory = () => {
        setFormData(prev => ({
            ...prev,
            categories: [...prev.categories, { categoryId: '', amount: '' }]
        }));
    };

    const removeCategory = (index) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== index)
        }));
    };

    const handleCategoryChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.map((cat, i) =>
                i === index ? { ...cat, [field]: value } : cat
            )
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!formData.monthIncome || formData.categories.length === 0) {
                throw new Error('Please fill in all required fields including at least one category');
            }

            console.log('Sending budget data:', {
                monthIncome: Number(formData.monthIncome),
                month: Number(formData.month),
                year: Number(formData.year)
            });

            const budgetResponse = await fetch('/api/budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    monthIncome: Number(formData.monthIncome),
                    month: Number(formData.month),
                    year: Number(formData.year)
                })
            });

            const responseText = await budgetResponse.text();
            console.log('Raw response:', responseText);

            if (!budgetResponse.ok) {
                throw new Error(`Failed to create budget: ${responseText}`);
            }

            const budgetData = JSON.parse(responseText);
            console.log('Created budget:', budgetData);

            // Link budget to user
            await fetch('/api/userbudget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.userId,
                    budgetId: budgetData.budgetId
                })
            });

            // Create budget categories
            for (const category of formData.categories) {
                await fetch('/api/budgetcat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        budgetId: budgetData.budgetId,
                        catId: Number(category.categoryId),
                        budgetAmount: Number(category.amount)
                    })
                });
            }

            setShowCreateForm(false);
            setFormData(initialFormData);
            loadBudgets();
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.message);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h2 className="text-2xl font-bold">Budget Details</h2>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Create New Budget</span>
                </button>
            </div>

            {error && (
                <Alert variant="destructive">
                    {error}
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Budget Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4">Period</th>
                                    <th className="text-left p-4">Monthly Income</th>
                                    <th className="text-left p-4">Categories</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budgets.map((budget) => (
                                    <tr key={budget.budgetId} className="hover:bg-gray-50">
                                        <td className="p-4">{budget.month}/{budget.year}</td>
                                        <td className="p-4">${budget.monthIncome.toFixed(2)}</td>
                                        <td className="p-4">
                                            {budget.categories?.map((cat, index) => (
                                                <div key={index} className="text-sm text-gray-600">
                                                    {cat.catId}: ${cat.budgetAmount.toFixed(2)}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Budget</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="monthIncome" className="text-right">
                                Monthly Income
                            </label>
                            <input
                                id="monthIncome"
                                name="monthIncome"
                                type="number"
                                className="col-span-3 p-2 border rounded"
                                placeholder="Enter monthly income"
                                value={formData.monthIncome}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="month" className="text-right">
                                Month
                            </label>
                            <select
                                id="month"
                                name="month"
                                className="col-span-3 p-2 border rounded"
                                value={formData.month}
                                onChange={handleInputChange}
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                    <option key={month} value={month}>
                                        {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="year" className="text-right">
                                Year
                            </label>
                            <select
                                id="year"
                                name="year"
                                className="col-span-3 p-2 border rounded"
                                value={formData.year}
                                onChange={handleInputChange}
                            >
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold">Budget Categories</h3>
                                <button
                                    type="button"
                                    onClick={addCategory}
                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Category
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.categories.map((category, index) => (
                                    <div key={index} className="flex gap-4">
                                        <select
                                            value={category.categoryId}
                                            onChange={(e) => handleCategoryChange(index, 'categoryId', e.target.value)}
                                            className="flex-1 p-2 border rounded"
                                        >
                                            <option value="">Select Category</option>
                                            {availableCategories.map((cat) => (
                                                <option key={cat.catId} value={cat.catId}>
                                                    {cat.catDesc}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            value={category.amount}
                                            onChange={(e) => handleCategoryChange(index, 'amount', e.target.value)}
                                            placeholder="Amount"
                                            className="w-32 p-2 border rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeCategory(index)}
                                            className="p-2 text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {formData.monthIncome && (
                                <div className="mt-4 p-4 bg-gray-50 rounded">
                                    <div className="flex justify-between text-sm">
                                        <span>Monthly Income:</span>
                                        <span>${Number(formData.monthIncome).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-1">
                                        <span>Allocated:</span>
                                        <span>${(Number(formData.monthIncome) - remainingAmount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold mt-1">
                                        <span>Remaining:</span>
                                        <span className={remainingAmount < 0 ? 'text-red-500' : 'text-green-500'}>
                                            ${remainingAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            onClick={() => setShowCreateForm(false)}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Create Budget
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

BudgetPage.propTypes = {
    onBack: PropTypes.func.isRequired,
};

export default BudgetPage;