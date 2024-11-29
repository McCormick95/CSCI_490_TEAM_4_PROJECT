import PropTypes from 'prop-types';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenseData } from '@/hooks/useExpenseData';

export const ExpensesPage = ({ onBack }) => {
    const { expenseData, loading, error } = useExpenseData();

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
                <button
                    onClick={onBack}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!expenseData || expenseData.spendingTrends.length === 0) {
        return (
            <div className="text-center p-4">
                <p>No expense data available. Start by adding some expenses.</p>
                <button
                    onClick={onBack}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold">Expense Analysis</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Expense Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={expenseData.spendingTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => [`$${value}`, "Expenses"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expenses"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Recent Expenses</h3>
                        <div className="space-y-2">
                            {expenseData.expenses.slice(0, 5).map((expense) => (
                                <div
                                    key={expense.id}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                    <div>
                                        <span className="font-medium">{expense.description}</span>
                                        <span className="text-sm text-gray-500 ml-2">({expense.date})</span>
                                    </div>
                                    <span className="font-medium text-red-500">-${expense.amount}</span>
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