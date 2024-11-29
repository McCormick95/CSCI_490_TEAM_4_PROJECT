import { useState } from 'react';
import PropTypes from 'prop-types';
import { DashboardOverview } from '@/features/dashboard/DashboardOverview';
import { BudgetPage } from '@/features/dashboard/Budget';
import { ExpensesPage } from '@/features/dashboard/Expenses';

const Dashboard = ({ className = '' }) => {
    const [currentView, setCurrentView] = useState('overview');

    const handleNavigate = (view) => {
        setCurrentView(view);
    };

    const handleBack = () => {
        setCurrentView('overview');
    };

    return (
        <div className={`min-h-screen bg-gray-100 p-8 ${className}`}>
            <div className="max-w-7xl mx-auto">
                {currentView === 'overview' && (
                    <DashboardOverview onNavigate={handleNavigate} />
                )}
                {currentView === 'budget' && (
                    <BudgetPage onBack={handleBack} />
                )}
                {currentView === 'expenses' && (
                    <ExpensesPage onBack={handleBack} />
                )}
            </div>
        </div>
    );
};

// Define the prop types for the Dashboard component
Dashboard.propTypes = {
    className: PropTypes.string, // Optional className for styling
};

// Define default props
Dashboard.defaultProps = {
    className: '',
};

export default Dashboard;