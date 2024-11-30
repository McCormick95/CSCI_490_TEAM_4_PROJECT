import PropTypes from 'prop-types';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudgetData } from '@/hooks/useBudgetData';

export const BudgetPage = ({ onBack }) => {
    const { budgetData, loading, error } = useBudgetData();

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h2 className="text-2xl font-bold">Budget Details</h2>
                </div>
                <div>Loading...</div>
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
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!budgetData?.budgets || budgetData.budgets.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h2 className="text-2xl font-bold">Budget Details</h2>
                </div>
                <Card>
                    <CardContent>
                        <p className="text-center py-4">No budgets found. Create a budget to get started.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        const safeAmount = Number(amount) || 0;
        return `$${safeAmount.toFixed(2)}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold">Budget Details</h2>
            </div>

            {budgetData.budgets.map((budget) => (
                <Card key={budget.budgetId}>
                    <CardHeader>
                        <CardTitle>Budget for {budget.month}/{budget.year}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Monthly Income</p>
                                    <p className="text-2xl font-bold">{formatCurrency(budget.monthIncome)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Allocated</p>
                                    <p className="text-2xl font-bold">{formatCurrency(budget.allocatedAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Remaining</p>
                                    <p className="text-2xl font-bold">{formatCurrency(budget.remainingAmount)}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold mb-2">Category Breakdown</h3>
                                {(budget.categories || []).map((category) => (
                                    <div
                                        key={`${budget.budgetId}-${category?.categoryId || Math.random()}`}
                                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                    >
                                        <span>{category?.name || 'Unnamed Category'}</span>
                                        <span className="font-medium">
                                            {formatCurrency(category?.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

BudgetPage.propTypes = {
    onBack: PropTypes.func.isRequired,
};