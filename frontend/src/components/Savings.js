import React, { useState, useEffect } from 'react';
import { getSavings, addSavings, addMoneyToSavings, deleteSavings } from '../services/api';
import './Savings.css';

function Savings() {
  const [savings, setSavings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(null);
  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    deadline: ''
  });
  const [addAmount, setAddAmount] = useState('');

  useEffect(() => {
    fetchSavings();
  }, []);

  const fetchSavings = async () => {
    try {
      const response = await getSavings();
      setSavings(response.data);
    } catch (error) {
      console.error('Error fetching savings:', error);
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
      await addSavings(formData);
      alert('Savings goal created successfully!');
      setShowForm(false);
      setFormData({
        goalName: '',
        targetAmount: '',
        deadline: ''
      });
      fetchSavings();
    } catch (error) {
      alert('Error creating savings goal');
      console.error(error);
    }
  };

  const handleAddMoney = async (id) => {
    if (!addAmount || addAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      await addMoneyToSavings(id, addAmount);
      alert('Money added to savings!');
      setShowAddMoney(null);
      setAddAmount('');
      fetchSavings();
    } catch (error) {
      alert('Error adding money');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      try {
        await deleteSavings(id);
        alert('Savings goal deleted!');
        fetchSavings();
      } catch (error) {
        alert('Error deleting savings goal');
        console.error(error);
      }
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="savings-container">
      <div className="savings-header">
        <h2>💰 Savings Goals</h2>
        <button onClick={() => setShowForm(!showForm)} className="add-savings-btn">
          {showForm ? 'Cancel' : '+ New Goal'}
        </button>
      </div>

      {showForm && (
        <div className="savings-form">
          <h3>Create Savings Goal</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Goal Name</label>
              <input
                type="text"
                name="goalName"
                value={formData.goalName}
                onChange={handleChange}
                placeholder="e.g., New Laptop, Vacation"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target Amount (৳)</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  placeholder="Enter target amount"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">Create Goal</button>
          </form>
        </div>
      )}

      <div className="savings-list">
        {savings.length === 0 ? (
          <div className="no-savings">
            <p>🎯 No savings goals yet. Create your first goal to start saving!</p>
          </div>
        ) : (
          savings.map((goal) => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const daysLeft = getDaysRemaining(goal.deadline);
            const isCompleted = progress >= 100;

            return (
              <div key={goal._id} className={`savings-card ${isCompleted ? 'completed' : ''}`}>
                <div className="savings-card-header">
                  <h3>{goal.goalName}</h3>
                  {isCompleted && <span className="completed-badge">✅ Completed!</span>}
                </div>

                <div className="savings-info">
                  <div className="info-row">
                    <span className="label">Target:</span>
                    <span className="value">৳{goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Saved:</span>
                    <span className="value saved">৳{goal.currentAmount.toFixed(2)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Remaining:</span>
                    <span className="value remaining">
                      ৳{(goal.targetAmount - goal.currentAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Deadline:</span>
                    <span className="value">{formatDate(goal.deadline)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Days Left:</span>
                    <span className={`value ${daysLeft < 30 ? 'urgent' : ''}`}>
                      {daysLeft > 0 ? `${daysLeft} days` : 'Overdue'}
                    </span>
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-bar-savings">
                    <div 
                      className="progress-fill-savings" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{progress.toFixed(1)}% achieved</span>
                </div>

                <div className="savings-actions">
                  {showAddMoney === goal._id ? (
                    <div className="add-money-form">
                      <input
                        type="number"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                      />
                      <button onClick={() => handleAddMoney(goal._id)} className="confirm-btn">
                        Confirm
                      </button>
                      <button onClick={() => { setShowAddMoney(null); setAddAmount(''); }} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => setShowAddMoney(goal._id)} className="add-money-btn">
                        + Add Money
                      </button>
                      <button onClick={() => handleDelete(goal._id)} className="delete-savings-btn">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Savings;