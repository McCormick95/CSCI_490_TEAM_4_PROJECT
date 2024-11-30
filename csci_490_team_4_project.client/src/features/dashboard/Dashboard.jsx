import { useState } from 'react';
import PropTypes from 'prop-types';
import { DashboardOverview } from '@/features/dashboard/DashboardOverview';
import { BudgetPage } from '@/features/dashboard/Budget';
import { ExpensesPage } from '@/features/dashboard/Expenses';
import { Card } from '@/components/ui/card';

const Dashboard = ({ className = '' }) => {
    const [currentView, setCurrentView] = useState('overview');

    const handleNavigate = (view) => {
        setCurrentView(view);
    };

    const handleBack = () => {
        setCurrentView('overview');
    };

    return (
        <div className="min-h-screen bg-[#242424]">
            <div className="max-w-7xl mx-auto p-8">
                <Card className="bg-gray-800 shadow-lg rounded-lg mb-8 border-gray-700">
                    <div className="p-6">
                        {currentView === 'overview' && (
                            <div className="space-y-8">
                                <DashboardOverview onNavigate={handleNavigate} />
                            </div>
                        )}
                        {currentView === 'budget' && (
                            <div className="space-y-8">
                                <BudgetPage onBack={handleBack} />
                            </div>
                        )}
                        {currentView === 'expenses' && (
                            <div className="space-y-8">
                                <ExpensesPage onBack={handleBack} />
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

Dashboard.propTypes = {
    className: PropTypes.string,
};

export default Dashboard;