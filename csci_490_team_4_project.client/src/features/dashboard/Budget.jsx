import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBudgetData } from '@/hooks/useBudgetData';

// Initial form data
const initialFormData = {
    monthIncome: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    categories: []
};

// BudgetRow component for displaying individual budget entries
const BudgetRow = ({ budget, isExpanded, onToggle }) => {
    const formatCurrency = (amount) => {
        const safeAmount = Number(amount) || 0;
        return `$${safeAmount.toFixed(2)}`;
    };

    return (
        <>
            <tr
                className="hover:bg-gray-50 cursor-pointer"
                onClick={onToggle}
            >
                <td className="p-4 flex items-center gap-2">
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                    {budget.month}/{budget.year}
                </td>
                <td className="p-4">{formatCurrency(budget.monthIncome)}</td>
                <td className="p-4">{formatCurrency(budget.allocatedAmount)}</td>
                <td className="p-4">{formatCurrency(budget.remainingAmount)}</td>
            </tr>
            {isExpanded && (
                <tr>
                    <td colSpan="4" className="bg-gray-50 p-4">
                        <div className="ml-6">
                            <h4 className="font-semibold mb-2">Category Breakdown</h4>
                            <div className="space-y-2">
                                {budget.categories.map((category) => (
                                    <div
                                        key={category.categoryId}
                                        className="flex items-center justify-between p-2 bg-white rounded shadow-sm"
                                    >
                                        <span>{category.name}</span>
                                        <span className="font-medium">
                                            {formatCurrency(category.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

BudgetRow.propTypes = {
    budget: PropTypes.shape({
        month: PropTypes.number.isRequired,
        year: PropTypes.number.isRequired,
        monthIncome: PropTypes.number.isRequired,
        allocatedAmount: PropTypes.number.isRequired,
        remainingAmount: PropTypes.number.isRequired,
        categories: PropTypes.arrayOf(
            PropTypes.shape({
                categoryId: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                amount: PropTypes.number.isRequired,
            })
        ).isRequired,
    }).isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export const BudgetPage = ({ onBack }) => {
    const { budgetData, loading, error } = useBudgetData();
    const [expandedBudgetId, setExpandedBudgetId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [remainingAmount, setRemainingAmount] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/category');
                if (response.ok) {
                    const data = await response.json();
                    setAvailableCategories(Array.isArray(data) ? data : [data]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const totalAllocated = formData.categories.reduce((sum, cat) => sum + (Number(cat.amount) || 0), 0);
        const remaining = Number(formData.monthIncome) - totalAllocated;
        setRemainingAmount(remaining);
    }, [formData.monthIncome, formData.categories]);

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
        if (!formData.monthIncome || formData.categories.length === 0) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const budgetResponse = await fetch('/api/budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    monthIncome: Number(formData.monthIncome),
                    month: Number(formData.month),
                    year: Number(formData.year)
                })
            });

            if (!budgetResponse.ok) throw new Error('Failed to create budget');
            const budgetData = await budgetResponse.json();

            // Create budget categories
            for (const category of formData.categories) {
                await fetch('/api/budgetcat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        budgetId: budgetData.budgetId,
                        catId: Number(category.categoryId),
                        budgetAmount: Number(category.amount)
                    })
                });
            }

            setShowCreateForm(false);
            setFormData(initialFormData);
            // Refresh the budgets list (you might need to implement this in useBudgetData)
        } catch (error) {
            console.error('Error creating budget:', error);
            alert('Failed to create budget. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h2 className="text-2xl font-bold">Budget Details</h2>
                </div>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h2 className="text-2xl font-bold">Budget Details</h2>
                </div>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-red-500 text-center">Error: {error}</div>
                    </CardContent>
                </Card>
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
                    <span>Create New Budget</span>
                </button>
            </div>

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
                                    <th className="text-left p-4">Allocated</th>
                                    <th className="text-left p-4">Remaining</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budgetData?.budgets?.map((budget) => (
                                    <BudgetRow
                                        key={budget.budgetId}
                                        budget={budget}
                                        isExpanded={expandedBudgetId === budget.budgetId}
                                        onToggle={() => setExpandedBudgetId(
                                            expandedBudgetId === budget.budgetId ? null : budget.budgetId
                                        )}
                                    />
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