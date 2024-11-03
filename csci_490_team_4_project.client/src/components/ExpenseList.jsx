import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (err) {
      setError('Error loading expenses');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading expenses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Expenses</h1>
      <ul>
        {expenses.map(expense => (
          <li key={expense.expenseId}>
            {expense.year}/{expense.month}/{expense.day}: {expense.userDesc} - ${expense.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;