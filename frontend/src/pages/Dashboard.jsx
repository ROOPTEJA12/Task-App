import React, { useState, useEffect } from 'react';
import { getDashboardStats, getOverdueTasks } from '../utils/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, overdueRes] = await Promise.all([
        getDashboardStats(),
        getOverdueTasks(),
      ]);
      setStats(statsRes.data);
      setOverdueTasks(overdueRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{stats?.totalTasks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>To Do</h3>
          <p className="stat-number">{stats?.toDoTasks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">{stats?.inProgressTasks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{stats?.doneTasks || 0}</p>
        </div>
        <div className="stat-card overdue">
          <h3>Overdue</h3>
          <p className="stat-number">{stats?.overdueTasks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Completion Rate</h3>
          <p className="stat-number">{stats?.completionRate || 0}%</p>
        </div>
      </div>

      <div className="overdue-section">
        <h2>Overdue Tasks</h2>
        {overdueTasks.length === 0 ? (
          <p>No overdue tasks!</p>
        ) : (
          <ul className="task-list">
            {overdueTasks.map((task) => (
              <li key={task._id} className="task-item">
                <h4>{task.title}</h4>
                <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={fetchDashboardData} className="refresh-btn">
        Refresh
      </button>
    </div>
  );
};

export default Dashboard;
