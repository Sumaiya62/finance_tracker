import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import './Charts.css';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function Charts() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

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

  if (loading) {
    return <div className="loading">Loading charts...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="charts-container">
        <h2>Analytics</h2>
        <p className="no-data">No data available for charts. Add some transactions first!</p>
      </div>
    );
  }

  // Pie Chart Data - Category-wise Expenses
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryData = {};
  
  expenses.forEach(expense => {
    if (categoryData[expense.category]) {
      categoryData[expense.category] += expense.amount;
    } else {
      categoryData[expense.category] = expense.amount;
    }
  });

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Bar Chart Data - Income vs Expense
  const incomeByCategory = {};
  const expenseByCategory = {};

  transactions.forEach(t => {
    if (t.type === 'income') {
      incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
    } else {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    }
  });

  const allCategories = [...new Set([...Object.keys(incomeByCategory), ...Object.keys(expenseByCategory)])];

  const barData = {
    labels: allCategories,
    datasets: [
      {
        label: 'Income',
        data: allCategories.map(cat => incomeByCategory[cat] || 0),
        backgroundColor: '#38ef7d',
        borderRadius: 5
      },
      {
        label: 'Expense',
        data: allCategories.map(cat => expenseByCategory[cat] || 0),
        backgroundColor: '#f45c43',
        borderRadius: 5
      }
    ]
  };

  // Line Chart Data - Monthly Trend
  const monthlyData = {};
  
  transactions.forEach(t => {
    const date = new Date(t.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { income: 0, expense: 0 };
    }
    
    if (t.type === 'income') {
      monthlyData[monthYear].income += t.amount;
    } else {
      monthlyData[monthYear].expense += t.amount;
    }
  });

  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
    const [m1, y1] = a.split('/');
    const [m2, y2] = b.split('/');
    return new Date(y1, m1) - new Date(y2, m2);
  });

  const lineData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Income',
        data: sortedMonths.map(month => monthlyData[month].income),
        borderColor: '#38ef7d',
        backgroundColor: 'rgba(56, 239, 125, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Expense',
        data: sortedMonths.map(month => monthlyData[month].expense),
        borderColor: '#f45c43',
        backgroundColor: 'rgba(244, 92, 67, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="charts-container">
      <h2>Analytics</h2>
      
      <div className="charts-grid">
        <div className="chart-box">
          <h3>Expense by Category</h3>
          <div className="chart-wrapper">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-box">
          <h3>Income vs Expense</h3>
          <div className="chart-wrapper">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-box full-width">
          <h3>Monthly Trend</h3>
          <div className="chart-wrapper">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts;