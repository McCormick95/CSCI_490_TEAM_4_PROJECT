import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import BudgetList from './components/BudgetList';
import ExpenseList from './components/ExpenseList';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'budgets':
        return <BudgetList />;
      case 'expenses':
        return <ExpenseList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <Navigation onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;