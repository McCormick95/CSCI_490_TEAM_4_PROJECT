import PropTypes from 'prop-types';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudgetData } from '@/hooks/useBudgetData';

export const BudgetPage = ({ onBack }) => {
    const { budgetData, loading, error } = useBudgetData();

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
                <p className="text-red-500">Error loading budget data: {error}</p>
                <button
                    onClick={onBack}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!budgetData) {
        return (
            <div className="text-center p-4">
                <p>No budget data available. Please set up your budget.</p>
                <button
                    onClick={onBack}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Calculate remaining budget
    const totalSpent = budgetData.categories.reduce((sum, cat) => sum + cat.amount, 0);
    const remaining = budgetData.totalBudget - totalSpent;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold">Budget Details</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Monthly Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Total Budget</p>
                                <p className="text-2xl font-bold">${budgetData.totalBudget}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Remaining</p>
                                <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    ${remaining}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {budgetData.categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                    <span>{category.name}</span>
                                    <span className="font-medium">${category.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

BudgetPage.propTypes = {
    onBack: PropTypes.func.isRequired,
};