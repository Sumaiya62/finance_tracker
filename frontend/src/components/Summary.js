import React, { useState, useEffect } from 'react';
import { getSummary } from '../services/api';
import './Summary.css';

function Summary() {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await getSummary();
      setSummary(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading summary...</div>;
  }

  return (
    <div className="summary-container">
      <div className="summary-card income-card">
        <h3>Total Income</h3>
        <p className="amount">৳{summary.income.toFixed(2)}</p>
      </div>

      <div className="summary-card expense-card">
        <h3>Total Expense</h3>
        <p className="amount">৳{summary.expense.toFixed(2)}</p>
      </div>

      <div className="summary-card balance-card">
        <h3>Balance</h3>
        <p className="amount">৳{summary.balance.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Summary;