import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/projectController.js';
import { verifyToken } from '../middleware/auth.js';
import { checkAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getProjects);
router.get('/:id', verifyToken, getProjectById);
router.put('/:id', verifyToken, updateProject);
router.delete('/:id', verifyToken, deleteProject);
router.post('/:id/members', verifyToken, addMember);
router.delete('/:id/members', verifyToken, removeMember);

export default router;
