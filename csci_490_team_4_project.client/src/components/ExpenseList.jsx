import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import ExpenseForm from './ExpenseForm';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      const data = await expenseService.getAll();
      setExpenses(data);
    } catch (err) {
      setError('Error loading expenses');
      console.error('Load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      setExpenses(expenses.filter(e => e.expenseId !== id));
    } catch (err) {
      setError('Error deleting expense');
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleUpdate = async (updatedExpense) => {
    try {
      await expenseService.updateExpense(updatedExpense.expenseId, updatedExpense);
      setExpenses(expenses.map(e => e.expenseId === updatedExpense.expenseId ? updatedExpense : e));
      setEditingExpense(null);
    } catch (err) {
      setError('Error updating expense');
      console.error('Update error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Expenses</h1>

      <ExpenseForm
        onExpenseAdded={loadExpenses}
        editingExpense={editingExpense}
        onUpdate={handleUpdate}
      />

      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

      {isLoading ? (
        <div className="text-center">Loading expenses...</div>
      ) : (
        <div className="space-y-4">
          {expenses.length > 0 ? (
            expenses.map(expense => (
              <div
                key={expense.expenseId}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      {expense.month}/{expense.day}/{expense.year}
                    </h3>
                    <p className="text-gray-600">
                      {expense.userDesc} - ${expense.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense.expenseId)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No expenses yet. Add one to get started!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;