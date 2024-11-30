import PropTypes from 'prop-types';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudgetData } from '@/hooks/useBudgetData';
import { useExpenseData } from '@/hooks/useExpenseData';

const DashboardCard = ({ title, value, icon: Icon, onClick, description, loading }) => (
    <Card className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 border-gray-600">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-100">
                {title}
            </CardTitle>
            <Icon className={`h-4 w-4 ${title.includes('Expenses') ? 'text-red-400' : 'text-gray-300'}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white">
                {loading ? (
                    <span className="text-gray-400">Loading...</span>
                ) : (
                    `$${value.toFixed(2)}`
                )}
            </div>
            {description && (
                <p className="text-sm text-gray-300 mt-2">{description}</p>
            )}
        </CardContent>
    </Card>
);

DashboardCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    icon: PropTypes.elementType.isRequired,
    onClick: PropTypes.func.isRequired,
    description: PropTypes.string,
    loading: PropTypes.bool
};

export const DashboardOverview = ({ onNavigate }) => {
    const { budgetData, loading: budgetLoading } = useBudgetData();
    const { expenseData, loading: expenseLoading } = useExpenseData();

    const getCurrentBudgetAmount = () => {
        if (!budgetData?.budgets?.length) return 0;
        return budgetData.budgets[0].monthIncome || 0;
    };

    const getTotalExpenses = () => {
        if (!expenseData?.expenses?.length) return 0;
        return expenseData.expenses.reduce((total, expense) => {
            return total + (Number(expense.amount) || 0);
        }, 0);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Financial Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="cursor-pointer" onClick={() => onNavigate('budget')}>
                    <DashboardCard
                        title="Budget Overview"
                        value={getCurrentBudgetAmount()}
                        icon={DollarSign}
                        onClick={() => onNavigate('budget')}
                        description="Click to view budget details"
                        loading={budgetLoading}
                    />
                </div>
                <div className="cursor-pointer" onClick={() => onNavigate('expenses')}>
                    <DashboardCard
                        title="Expenses Overview"
                        value={getTotalExpenses()}
                        icon={TrendingUp}
                        onClick={() => onNavigate('expenses')}
                        description="Click to view expense analysis"
                        loading={expenseLoading}
                    />
                </div>
            </div>
        </div>
    );
};

DashboardOverview.propTypes = {
    onNavigate: PropTypes.func.isRequired
};

export default DashboardOverview;