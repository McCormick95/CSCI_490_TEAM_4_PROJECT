import PropTypes from 'prop-types';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const DashboardCard = ({ title, value, icon: Icon, onClick, description }) => (
    <div onClick={onClick} className="cursor-pointer transform hover:scale-105 transition-transform">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${title.includes('Expenses') ? 'text-red-500' : 'text-gray-500'}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${value}</div>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </CardContent>
        </Card>
    </div>
);

// PropTypes for the DashboardCard component
DashboardCard.propTypes = {
    title: PropTypes.string.isRequired,        // Must be a string and is required
    value: PropTypes.number.isRequired,        // Must be a number and is required
    icon: PropTypes.elementType.isRequired,    // Must be a component/element type and is required
    onClick: PropTypes.func.isRequired,        // Must be a function and is required
    description: PropTypes.string              // Must be a string if provided, but is optional
};

export const DashboardOverview = ({ onNavigate }) => (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
                title="Budget Overview"
                value={5000}
                icon={DollarSign}
                onClick={() => onNavigate('budget')}
                description="Click to view budget details"
            />
            <DashboardCard
                title="Expenses Overview"
                value={3500}
                icon={TrendingUp}
                onClick={() => onNavigate('expenses')}
                description="Click to view expense analysis"
            />
        </div>
    </div>
);

// PropTypes for the DashboardOverview component
DashboardOverview.propTypes = {
    onNavigate: PropTypes.func.isRequired  // Must be a function and is required
};