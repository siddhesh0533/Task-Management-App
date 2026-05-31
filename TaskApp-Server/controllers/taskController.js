const Task = require('../models/Task');

// @desc    Get all tasks (manager: all | employee: own)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const filter = req.user.role === 'manager' ? {} : { assignedTo: req.user._id };

    // Optional status filter via query param: /api/tasks?status=pending
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Employees can only view their own tasks
    if (
      req.user.role === 'employee' &&
      task.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (manager only)
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      deadline: deadline || null,
      createdBy: req.user._id,
    });

    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (manager: full edit | employee: status only, own task)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'employee') {
      // Employee can only update status of their own assigned task
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only update your own tasks' });
      }
      if (req.body.status) task.status = req.body.status;
      // Ignore other fields silently
    } else {
      // Manager can update any field
      const { title, description, assignedTo, status, deadline } = req.body;
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (status !== undefined) task.status = status;
      if (deadline !== undefined) task.deadline = deadline;
    }

    await task.save();

    const updated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (manager only)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get task summary counts (for dashboard)
// @route   GET /api/tasks/summary
// @access  Private
const getTaskSummary = async (req, res) => {
  try {
    const filter = req.user.role === 'manager' ? {} : { assignedTo: req.user._id };

    const [total, pending, inProgress, completed] = await Promise.all([
      Task.countDocuments(filter),
      Task.countDocuments({ ...filter, status: 'pending' }),
      Task.countDocuments({ ...filter, status: 'in-progress' }),
      Task.countDocuments({ ...filter, status: 'completed' }),
    ]);

    res.json({ total, pending, inProgress, completed });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, getTaskSummary };
