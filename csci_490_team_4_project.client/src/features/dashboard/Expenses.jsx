import { useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { useExpenseData } from '@/hooks/useExpenseData';
import { AddExpenseForm } from "@/features/dashboard/AddExpenseForm";

export const ExpensesPage = ({ onBack }) => {
    const { expenseData, loading, error, refetch } = useExpenseData();
    const [showAddForm, setShowAddForm] = useState(false);

    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) {
            return;
        }
    
        try {
            const response = await fetch(`/api/expense/${expenseId}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete expense');
            }
    
            // Refresh the expenses list using the existing refetch function
            refetch();
        } catch (err) {
            console.error('Delete error:', err);
            setError('Failed to delete expense');
        }
    };
    
    
    const handleExpenseAdded = () => {
        refetch();
        setShowAddForm(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4">
                <p className="text-red-500">Error loading expense data: {error}</p>
                <button onClick={onBack} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Go Back
                </button>
            </div>
        );
    }

    const formatCurrency = (value) => `$${value.toFixed(2)}`;

    // Ensure data is in the correct format for the chart
    const chartData = expenseData?.categoryTrends?.map(item => ({
        name: item.category,
        amount: item.total
    })) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h2 className="text-2xl font-bold">Expense Analysis</h2>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <Plus className="h-5 w-5" />
                    Add Expense
                </button>
            </div>

            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-lg">
                        <AddExpenseForm
                            onExpenseAdded={handleExpenseAdded}
                            onClose={() => setShowAddForm(false)}
                        />
                    </div>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Fixed height container for the chart */}
                    <div style={{ width: '100%', height: '400px' }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 60,
                                    bottom: 60
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    interval={0}
                                />
                                <YAxis
                                    tickFormatter={formatCurrency}
                                />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    labelFormatter={(label) => `Category: ${label}`}
                                />
                                <Legend />
                                <Bar
                                    dataKey="amount"
                                    fill="#8884d8"
                                    name="Amount"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Recent Expenses</h3>
                        <div className="space-y-2">
                        {expenseData?.expenses?.map((expense) => (
                            <div
                                key={expense.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                                <div>
                                    <span className="font-medium">{expense.description}</span>
                                    <span className="text-sm text-gray-500 ml-2">({expense.category})</span>
                                    <span className="text-sm text-gray-500 ml-2">{expense.date}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-medium text-red-500">
                                        {formatCurrency(expense.amount)}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteExpense(expense.id)}
                                        className="p-2 text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

ExpensesPage.propTypes = {
    onBack: PropTypes.func.isRequired,
};