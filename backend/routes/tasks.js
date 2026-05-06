import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getOverdueTasks,
  getDashboardStats,
} from '../controllers/taskController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createTask);
router.get('/', verifyToken, getTasks);
router.get('/stats/dashboard', verifyToken, getDashboardStats);
router.get('/status/overdue', verifyToken, getOverdueTasks);
router.get('/:id', verifyToken, getTaskById);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, deleteTask);

export default router;
