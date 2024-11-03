import React, { useState, useEffect } from 'react';
import budgetService from '../services/budgetService';
import BudgetForm from './BudgetForm';

function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setIsLoading(true);
      const data = await budgetService.getAllBudgets();
      setBudgets(data);
    } catch (err) {
      setError('Error loading budgets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetAdded = async (newBudget) => {
    try {
      await budgetService.addBudget(newBudget);
      loadBudgets();
    } catch (err) {
      setError('Error adding budget');
    }
  };

  if (isLoading) return <div>Loading budgets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Budgets</h1>
      <BudgetForm onBudgetAdded={handleBudgetAdded} />
      <ul>
        {budgets.map(budget => (
          <li key={budget.budgetId}>
            {budget.year}/{budget.month}: ${budget.monthIncome}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BudgetList;