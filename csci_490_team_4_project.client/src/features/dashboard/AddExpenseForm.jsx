import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { X } from 'lucide-react';

const AddExpenseForm = ({ onExpenseAdded, onClose }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/category');
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                setCategories(Array.isArray(data) ? data : [data]);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories');
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            if (!formData.amount || !formData.description || !formData.categoryId || !formData.date) {
                throw new Error('Please fill in all fields');
            }

            // Parse the date
            const dateObj = new Date(formData.date);

            // Create expense
            const expenseResponse = await fetch('/api/expense', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(formData.amount),
                    userDesc: formData.description,
                    catId: parseInt(formData.categoryId),
                    year: dateObj.getFullYear(),
                    month: dateObj.getMonth() + 1,
                    day: dateObj.getDate()
                })
            });

            if (!expenseResponse.ok) {
                const errorText = await expenseResponse.text();
                throw new Error(errorText);
            }

            const expenseData = await expenseResponse.json();

            // Link expense to user
            const userExpenseResponse = await fetch('/api/userexpense', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.userId,
                    expenseId: expenseData.expenseId
                })
            });

            if (!userExpenseResponse.ok) {
                throw new Error('Failed to link expense to user');
            }

            setSuccess(true);
            setFormData({
                amount: '',
                description: '',
                categoryId: '',
                date: new Date().toISOString().split('T')[0]
            });
            onExpenseAdded();
        } catch (err) {
            console.error('Error adding expense:', err);
            setError(err.message || 'Failed to add expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Add New Expense</CardTitle>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <X className="h-5 w-5" />
                </button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            step="0.01"
                            required
                            className="w-full p-2 border rounded"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                            placeholder="Enter expense description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category.catId} value={category.catId}>
                                    {category.catDesc}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert className="bg-green-50 text-green-700">
                            Expense added successfully!
                        </Alert>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? 'Adding...' : 'Add Expense'}
                    </button>
                </form>
            </CardContent>
        </Card>
    );
};

AddExpenseForm.propTypes = {
    onExpenseAdded: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export { AddExpenseForm };