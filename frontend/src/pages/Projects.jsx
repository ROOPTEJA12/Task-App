import React, { useState, useEffect } from 'react';
import { getProjects, createProject, deleteProject, addProjectMember } from '../utils/api';
import '../styles/Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedProject, setSelectedProject] = useState(null);
  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject(formData.name, formData.description);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
    }
  };

  if (loading) return <div className="projects-container"><p>Loading...</p></div>;

  return (
    <div className="projects-container">
      <h1>Projects</h1>

      {error && <div className="error-message">{error}</div>}

      <button onClick={() => setShowForm(!showForm)} className="create-btn">
        {showForm ? 'Cancel' : 'Create New Project'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateProject} className="form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Project Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <button type="submit" className="submit-btn">Create</button>
        </form>
      )}

      <div className="projects-list">
        {projects.length === 0 ? (
          <p>No projects yet. Create one to get started!</p>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p><strong>Members:</strong> {project.members?.length || 0}</p>
              <p><strong>Tasks:</strong> {project.tasks?.length || 0}</p>
              <div className="project-actions">
                <a href={`/projects/${project._id}`} className="view-btn">View</a>
                <button onClick={() => handleDeleteProject(project._id)} className="delete-btn">
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

export default Projects;
