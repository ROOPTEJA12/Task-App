import Task from '../models/Task.js';
import Project from '../models/Project.js';

// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    if (!title || !projectId || !assignedTo) {
      return res.status(400).json({ message: 'Title, project, and assignee are required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.userId && req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Only project owner can create tasks' });
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignedTo,
      createdBy: req.userId,
      priority,
      dueDate,
    });

    await task.save();
    project.tasks.push(task._id);
    await project.save();

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Tasks (with filters)
export const getTasks = async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;

    let filter;

    // Admin can see all tasks, Members see only their tasks
    if (req.userRole === 'Admin') {
      filter = {}; // No filter - see all tasks
    } else {
      filter = {
        $or: [{ assignedTo: req.userId }, { createdBy: req.userId }],
      };
    }

    if (projectId) filter.project = projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assignedTo.toString() !== req.userId && task.createdBy.toString() !== req.userId && req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (assignedTo) task.assignedTo = assignedTo;

    await task.save();
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy.toString() !== req.userId && req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Overdue Tasks
export const getOverdueTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.userId,
      status: { $ne: 'Done' },
      dueDate: { $lt: new Date() },
    })
      .populate('project', 'name')
      .populate('assignedTo', 'name');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ assignedTo: req.userId }, { createdBy: req.userId }],
    });

    const stats = {
      totalTasks: tasks.length,
      toDoTasks: tasks.filter((t) => t.status === 'To Do').length,
      inProgressTasks: tasks.filter((t) => t.status === 'In Progress').length,
      doneTasks: tasks.filter((t) => t.status === 'Done').length,
      overdueTasks: tasks.filter((t) => t.isOverdue && t.status !== 'Done').length,
      completionRate: tasks.length > 0 ? ((tasks.filter((t) => t.status === 'Done').length / tasks.length) * 100).toFixed(2) : 0,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
