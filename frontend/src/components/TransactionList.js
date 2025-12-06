import React, { useState, useEffect } from 'react';
import { getTransactions, deleteTransaction } from '../services/api';
import './TransactionList.css';

function TransactionList({ refresh }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [refresh]);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        alert('Transaction deleted successfully!');
        fetchTransactions();
      } catch (error) {
        alert('Error deleting transaction');
        console.error(error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-list-container">
        <h2>Recent Transactions</h2>
        <div className="no-transactions">
          <p>No transactions yet. Add your first transaction above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list-container">
      <h2>Recent Transactions</h2>
      <div className="transaction-list">
        {transactions.map((transaction) => (
          <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
            <div className="transaction-info">
              <div className="transaction-category">
                <span className="category-badge">{transaction.category}</span>
                <span className={`type-badge ${transaction.type}`}>
                  {transaction.type}
                </span>
              </div>
              <p className="transaction-description">
                {transaction.description || 'No description'}
              </p>
              <p className="transaction-date">{formatDate(transaction.date)}</p>
            </div>
            <div className="transaction-actions">
              <p className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}৳{transaction.amount.toFixed(2)}
              </p>
              <button 
                onClick={() => handleDelete(transaction._id)} 
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;