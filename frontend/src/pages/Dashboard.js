import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Charts from '../components/Charts';
import Budget from '../components/Budget';
import Savings from '../components/Savings';
import Footer from '../components/Footer';
import './Dashboard.css';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Manage your finances smartly and track your spending habits</p>
        </div>
        
        <Summary key={`summary-${refreshKey}`} />
        <Savings />
        <TransactionForm onTransactionAdded={handleTransactionAdded} />
        <TransactionList refresh={refreshKey} />
        <Charts key={`charts-${refreshKey}`} />
        <Budget key={`budget-${refreshKey}`} />
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;