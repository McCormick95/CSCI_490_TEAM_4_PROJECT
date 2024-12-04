import React, { useState } from 'react';
import expenseService from '../services/expenseService';

function ExpenseForm() {
  const [expense, setExpense] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    amount: '',
    userDesc: '',
    catId: 1
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        year: parseInt(expense.year),
        month: parseInt(expense.month),
        day: parseInt(expense.day),
        amount: parseFloat(expense.amount),
        userDesc: expense.userDesc,
        catId: 1
      };
      await expenseService.addExpense(expenseData);
      setExpense({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        amount: '',
        userDesc: '',
        catId: 1
      });
      setError(null);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : 
              name === 'userDesc' ? value : 
              parseInt(value)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Add New Expense</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Year</label>
            <input
              type="number"
              name="year"
              value={expense.year}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Month</label>
            <input
              type="number"
              name="month"
              value={expense.month}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="12"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-2">Day</label>
            <input
              type="number"
              name="day"
              value={expense.day}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="31"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <input
            type="text"
            name="userDesc"
            value={expense.userDesc}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-2 border border-blue-500 hover:border-transparent rounded-md transition-colors"
        >
          Add Expense
        </button>
      </div>
      
      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
    </form>
  );
}

export default ExpenseForm;
