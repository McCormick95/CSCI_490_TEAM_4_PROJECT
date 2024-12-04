import React from 'react';

function BudgetDetails({ budget }) {
  const getMonthName = (monthNumber) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1];
  };

  return (
    <div>
      <h2>Budget Details</h2>
      <div>
        <p>Period: {getMonthName(budget.month)} {budget.year}</p>
        <p>Monthly Income: ${budget.monthIncome}</p>
      </div>
    </div>
  );
}

export default BudgetDetails;