const express = require('express');
const router = express.Router();
const {
  getTasks, getTaskById, createTask, updateTask, deleteTask, getTaskSummary,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const { createTaskValidator, updateTaskValidator } = require('../validators/taskValidator');
const { validate } = require('../middleware/validate');

// All routes require authentication
router.use(protect);

router.get('/summary', getTaskSummary);                                               // Both roles
router.get('/',        getTasks);                                                     // Both roles (filtered)
router.get('/:id',     getTaskById);                                                  // Both roles (filtered)
router.post('/',       requireRole('manager'), createTaskValidator, validate, createTask); // Manager only
router.put('/:id',     updateTaskValidator, validate, updateTask);                   // Both (logic inside)
router.delete('/:id',  requireRole('manager'), deleteTask);                          // Manager only

module.exports = router;
