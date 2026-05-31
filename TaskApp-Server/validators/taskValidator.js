const { body } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3–100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('assignedTo')
    .notEmpty().withMessage('Assigned employee is required')
    .isMongoId().withMessage('Invalid employee ID'),

  body('deadline')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Deadline must be a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Deadline must be a future date');
      }
      return true;
    }),
];

const updateTaskValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3–100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),

  body('assignedTo')
    .optional()
    .isMongoId().withMessage('Invalid employee ID'),

  body('deadline')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Deadline must be a valid date'),
];

module.exports = { createTaskValidator, updateTaskValidator };
