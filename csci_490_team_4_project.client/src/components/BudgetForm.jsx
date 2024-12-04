import React, { useState, useEffect } from 'react';
import budgetService from '../services/budgetService';

function BudgetForm({ onBudgetAdded, editingBudget, onUpdate }) {
  const [budget, setBudget] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    monthIncome: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingBudget) {
      setBudget(editingBudget);
    }
  }, [editingBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await onUpdate(budget);
      } else {
        await budgetService.addBudget(budget);
        onBudgetAdded();
      }
      setBudget({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        monthIncome: ''
      });
      setError(null);
    } catch (err) {
      console.error('Failed to handle budget:', err);
      setError('Failed to process budget. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudget(prev => ({
      ...prev,
      [name]: value === '' ? '' :
        name === 'monthIncome' ? parseFloat(value) :
        parseInt(value)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">
        {editingBudget ? 'Edit Budget' : 'Add New Budget'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Year</label>
          <input
            type="number"
            name="year"
            value={budget.year}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Month</label>
          <input
            type="number"
            name="month"
            value={budget.month}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="12"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Monthly Income</label>
          <input
            type="number"
            name="monthIncome"
            value={budget.monthIncome}
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
          {editingBudget ? 'Update Budget' : 'Add Budget'}
        </button>
      </div>

      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
    </form>
  );
}

export default BudgetForm;