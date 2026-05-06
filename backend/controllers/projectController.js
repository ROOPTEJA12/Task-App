import Project from '../models/Project.js';
import User from '../models/User.js';

// Create Project
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = new Project({
      name,
      description,
      owner: req.userId,
      members: [req.userId],
    });

    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Projects (for current user)
export const getProjects = async (req, res) => {
  try {
    let filter;

    // Admin can see all projects, Members see only their projects
    if (req.userRole === 'Admin') {
      filter = {}; // No filter - see all projects
    } else {
      filter = {
        $or: [{ owner: req.userId }, { members: req.userId }],
      };
    }

    const projects = await Project.find(filter).populate('owner members', 'name email');

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner members tasks', 'name email title status');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Project (Admin only)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.userId && req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const { name, description, status } = req.body;
    if (name) project.name = name;
    if (description) project.description = description;
    if (status) project.status = status;

    await project.save();
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Project (Admin only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.userId && req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Member to Project
export const addMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.userId && req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Only project owner can add members' });
    }

    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (project.members.includes(memberId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(memberId);
    user.projects.push(project._id);

    await project.save();
    await user.save();

    res.status(200).json({ message: 'Member added successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove Member from Project
export const removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.userId && req.userRole !== 'Admin') {
      return res.status(403).json({ message: 'Only project owner can remove members' });
    }

    project.members = project.members.filter((id) => id.toString() !== memberId);
    await project.save();

    res.status(200).json({ message: 'Member removed successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
