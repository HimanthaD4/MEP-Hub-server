import Project from '../models/Project.js';

// GET all
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE
export const createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: error.message });
  }
};

// UPDATE
export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ message: 'Update failed' });
  }
};

// DELETE
export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Delete failed' });
  }
};

// TOGGLE VISIBILITY
export const toggleVisibility = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });

    project.visible = !project.visible;
    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error toggling visibility:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// TOGGLE STATUS (pending → active → completed → pending)
export const toggleStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });

    const nextStatus = {
      pending: 'active',
      active: 'completed',
      completed: 'pending'
    };

    project.status = nextStatus[project.status];
    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error toggling status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
