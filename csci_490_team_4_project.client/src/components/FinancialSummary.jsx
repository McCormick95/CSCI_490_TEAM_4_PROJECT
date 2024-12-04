import React from 'react';

function FinancialSummary({ budget, expenses }) {
  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateRemainingBudget = () => {
    const totalExpenses = calculateTotalExpenses();
    return budget ? budget.monthIncome - totalExpenses : 0;
  };

  return (
    <div>
      <h2>Financial Summary</h2>
      <div>
        <p>Total Budget: ${budget ? budget.monthIncome : 0}</p>
        <p>Total Expenses: ${calculateTotalExpenses()}</p>
        <p>Remaining: ${calculateRemainingBudget()}</p>
      </div>
    </div>
  );
}

export default FinancialSummary;