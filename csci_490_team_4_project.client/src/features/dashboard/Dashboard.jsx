import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '@/context/AuthContext';
import { DashboardOverview } from '@/features/dashboard/DashboardOverview';
import { BudgetPage } from '@/features/dashboard/Budget';
import { ExpensesPage } from '@/features/dashboard/Expenses';
import { Card } from '@/components/ui/card';

const Dashboard = ({ className = '' }) => {
    const [currentView, setCurrentView] = useState('overview');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavigate = (view) => {
        setCurrentView(view);
    };

    const handleBack = () => {
        setCurrentView('overview');
    };

    return (
        <div className="min-h-screen bg-[#242424]">
            <div className="max-w-7xl mx-auto p-8">
                <div className="flex justify-end items-center mb-4">
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
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
}

Dashboard.propTypes = {
    className: PropTypes.string,
};


export default Dashboard;