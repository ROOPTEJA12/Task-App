import axios from 'axios';

// Base API URL
const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

// ================= AUTH TOKEN =================

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common[
      'Authorization'
    ];
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// ================= AUTH APIs =================

export const signup = (
  name,
  email,
  password,
  role = 'Member'
) => {
  return axios.post(`${API_URL}/auth/signup`, {
    name,
    email,
    password,
    role,
  });
};

export const login = (email, password) => {
  return axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
};

export const getCurrentUser = () => {
  return axios.get(`${API_URL}/auth/me`);
};

// ================= PROJECT APIs =================

export const getProjects = () => {
  return axios.get(`${API_URL}/projects`);
};

export const getProjectById = (id) => {
  return axios.get(`${API_URL}/projects/${id}`);
};

export const createProject = (
  name,
  description
) => {
  return axios.post(`${API_URL}/projects`, {
    name,
    description,
  });
};

export const updateProject = (id, data) => {
  return axios.put(
    `${API_URL}/projects/${id}`,
    data
  );
};

export const deleteProject = (id) => {
  return axios.delete(
    `${API_URL}/projects/${id}`
  );
};

export const addProjectMember = (
  projectId,
  memberId
) => {
  return axios.post(
    `${API_URL}/projects/${projectId}/members`,
    { memberId }
  );
};

export const removeProjectMember = (
  projectId,
  memberId
) => {
  return axios.delete(
    `${API_URL}/projects/${projectId}/members`,
    {
      data: { memberId },
    }
  );
};

// ================= TASK APIs =================

export const getTasks = (
  projectId,
  status,
  priority
) => {
  return axios.get(`${API_URL}/tasks`, {
    params: {
      projectId,
      status,
      priority,
    },
  });
};

export const getTaskById = (id) => {
  return axios.get(`${API_URL}/tasks/${id}`);
};

export const createTask = (
  title,
  description,
  projectId,
  assignedTo,
  priority,
  dueDate
) => {
  return axios.post(`${API_URL}/tasks`, {
    title,
    description,
    projectId,
    assignedTo,
    priority,
    dueDate,
  });
};

export const updateTask = (id, data) => {
  return axios.put(
    `${API_URL}/tasks/${id}`,
    data
  );
};

export const deleteTask = (id) => {
  return axios.delete(
    `${API_URL}/tasks/${id}`
  );
};

export const getOverdueTasks = () => {
  return axios.get(
    `${API_URL}/tasks/status/overdue`
  );
};

export const getDashboardStats = () => {
  return axios.get(
    `${API_URL}/tasks/stats/dashboard`
  );
};

// ================= INIT TOKEN =================

const token = getAuthToken();

if (token) {
  setAuthToken(token);
}