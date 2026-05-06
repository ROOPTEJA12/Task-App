import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, getProjects, getCurrentUser } from '../utils/api';
import '../styles/Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchCurrentUser();
  }, [statusFilter]);

  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Failed to load current user');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to load projects');
    }
  };

  const handleProjectSelect = (projectId) => {
    setFormData({ ...formData, projectId });
    const selected = projects.find(p => p._id === projectId);
    if (selected && selected.members) {
      setProjectMembers(selected.members);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks('', statusFilter, '');
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask(
        formData.title,
        formData.description,
        formData.projectId,
        formData.assignedTo,
        formData.priority,
        formData.dueDate
      );
      setFormData({ title: '', description: '', projectId: '', assignedTo: '', priority: 'Medium', dueDate: '' });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  if (loading) return <div className="tasks-container"><p>Loading...</p></div>;

  return (
    <div className="tasks-container">
      <h1>Tasks</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="tasks-header">
        <button onClick={() => setShowForm(!showForm)} className="create-btn">
          {showForm ? 'Cancel' : 'Create New Task'}
        </button>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter">
          <option value="">All Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleCreateTask} className="form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <select
                value={formData.projectId}
                onChange={(e) => handleProjectSelect(e.target.value)}
                required
              >
                <option value="">-- Select Project --</option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                required
              >
                <option value="">-- Assign To --</option>
                {projectMembers.map(member => (
                  <option key={member._id} value={member._id}>
                    {member.name} {member._id === currentUser?._id ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">Create Task</button>
        </form>
      )}

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className={`task-card priority-${task.priority}`}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-info">
                <span className="priority-badge">{task.priority}</span>
                <span className={`status-badge ${task.status}`}>{task.status}</span>
              </div>
              <div className="task-actions">
                <select
                  value={task.status}
                  onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                  className="status-select"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <button onClick={() => handleDeleteTask(task._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
