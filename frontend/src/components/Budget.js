import React, { useState, useEffect } from 'react';
import { getBudgets, addBudget, checkBudget, deleteBudget } from '../services/api';
import './Budget.css';

function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [budgetStatus, setBudgetStatus] = useState({});

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await getBudgets();
      setBudgets(response.data);
      
      // Check budget status for each category
      response.data.forEach(async (budget) => {
        const status = await checkBudget(budget.category);
        setBudgetStatus(prev => ({
          ...prev,
          [budget.category]: status.data
        }));
      });
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBudget(formData);
      alert('Budget added successfully!');
      setShowForm(false);
      setFormData({
        category: '',
        limit: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
      fetchBudgets();
    } catch (error) {
      alert('Error adding budget');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
        alert('Budget deleted successfully!');
        fetchBudgets();
      } catch (error) {
        alert('Error deleting budget');
        console.error(error);
      }
    }
  };

  const getProgressPercentage = (spent, limit) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#dc3545';
    if (percentage >= 80) return '#ffc107';
    return '#28a745';
  };

  return (
    <div className="budget-container">
      <div className="budget-header">
        <h2>Budget Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="add-budget-btn">
          {showForm ? 'Cancel' : '+ Add Budget'}
        </button>
      </div>

      {showForm && (
        <div className="budget-form">
          <h3>Set New Budget</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Budget Limit (৳)</label>
                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleChange}
                  placeholder="Enter budget limit"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Month</label>
                <select name="month" value={formData.month} onChange={handleChange} required>
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="2020"
                  max="2100"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">Set Budget</button>
          </form>
        </div>
      )}

      <div className="budget-list">
        {budgets.length === 0 ? (
          <div className="no-budgets">
            <p>No budgets set yet. Click "Add Budget" to create one!</p>
          </div>
        ) : (
          budgets.map((budget) => {
            const status = budgetStatus[budget.category];
            const spent = status?.spent || 0;
            const percentage = getProgressPercentage(spent, budget.limit);
            const progressColor = getProgressColor(percentage);

            return (
              <div key={budget._id} className="budget-card">
                <div className="budget-card-header">
                  <h3>{budget.category}</h3>
                  <span className="budget-period">
                    {months[budget.month - 1]} {budget.year}
                  </span>
                </div>

                <div className="budget-amounts">
                  <div className="amount-item">
                    <span className="label">Budget:</span>
                    <span className="value">৳{budget.limit.toFixed(2)}</span>
                  </div>
                  <div className="amount-item">
                    <span className="label">Spent:</span>
                    <span className="value spent">৳{spent.toFixed(2)}</span>
                  </div>
                  <div className="amount-item">
                    <span className="label">Remaining:</span>
                    <span className={`value ${status?.remaining < 0 ? 'negative' : 'positive'}`}>
                      ৳{(status?.remaining || budget.limit).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: progressColor
                    }}
                  ></div>
                </div>

                <div className="progress-info">
                  <span>{percentage.toFixed(1)}% used</span>
                  {status?.warning && (
                    <span className="warning-badge">⚠️ Budget Exceeded!</span>
                  )}
                </div>

                <button 
                  onClick={() => handleDelete(budget._id)} 
                  className="delete-budget-btn"
                >
                  Delete Budget
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Budget;