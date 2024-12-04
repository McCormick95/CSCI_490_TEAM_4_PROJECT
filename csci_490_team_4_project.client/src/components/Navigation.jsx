import React from 'react';

function Navigation({ onNavigate }) {
  return (
    <nav>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', justifyContent: 'center', padding: '20px' }}>
        <li>
          <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
        </li>
        <li>
          <button onClick={() => onNavigate('budgets')}>Budgets</button>
        </li>
        <li>
          <button onClick={() => onNavigate('expenses')}>Expenses</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;