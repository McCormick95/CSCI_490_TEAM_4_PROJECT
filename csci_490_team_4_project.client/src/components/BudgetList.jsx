import React, { useState, useEffect } from 'react';
import budgetService from '../services/budgetService';
import BudgetForm from './BudgetForm';

function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setIsLoading(true);
      const data = await budgetService.getAllBudgets();
      setBudgets(data || []);
    } catch (err) {
      setError('Error loading budgets');
      console.error('Load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await budgetService.deleteBudget(id);
      setBudgets(budgets.filter(b => b.budgetId !== id));
    } catch (err) {
      setError('Error deleting budget');
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
  };

  const handleUpdate = async (updatedBudget) => {
    try {
      await budgetService.updateBudget(updatedBudget.budgetId, updatedBudget);
      setBudgets(budgets.map(b => b.budgetId === updatedBudget.budgetId ? updatedBudget : b));
      setEditingBudget(null);
    } catch (err) {
      setError('Error updating budget');
      console.error('Update error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Budget Management</h1>

      <BudgetForm
        onBudgetAdded={loadBudgets}
        editingBudget={editingBudget}
        onUpdate={handleUpdate}
      />

      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

      {isLoading ? (
        <div className="text-center">Loading budgets...</div>
      ) : (
        <div className="space-y-4">
          {budgets.length > 0 ? (
            budgets.map(budget => (
              <div
                key={budget.budgetId}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      {budget.month}/{budget.year}
                    </h3>
                    <p className="text-gray-600">
                      ${budget.monthIncome.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(budget.budgetId)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No budgets available. Add one to get started!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default BudgetList;